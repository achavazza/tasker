import { db } from "@/firebaseConfig";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore/lite";
import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", {
    state: () => ({
        tasks: [],  // Flat array of all tasks
        structuredTasks: [],  // Nested tasks structure
        loadingDoc: false,
        updateTimeout: null,  // Timeout reference for debouncing
    }),
    actions: {
        async fetchAllTasks() {
            this.loadingDoc = true;
            try {
                const querySnapshot = await getDocs(collection(db, "tasks"));
                this.tasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    children: []
                }));
                this.updateStructuredTasks();
            } catch (error) {
                console.error("Error fetching tasks:", error.message);
            } finally {
                this.loadingDoc = false;
            }
        },

        updateStructuredTasks() {
            const taskMap = {};
            const structured = [];

            // Map tasks by id for easy reference
            this.tasks.forEach(task => {
                taskMap[task.id] = { ...task, children: [] };
            });

            // Build structured hierarchy
            this.tasks.forEach(task => {
                if (task.parentId) {
                    taskMap[task.parentId]?.children.push(taskMap[task.id]);
                } else {
                    structured.push(taskMap[task.id]);
                }
            });

            this.structuredTasks = structured;
        },

        async addTask(desc, status, timeTracked, parentId = null) {
            this.loadingDoc = true;
            try {
                const newTask = {
                    desc,
                    status,
                    timeTracked,
                    updatedAt: new Date(),
                    createdAt: new Date(),
                    parentId
                };
                const docRef = await addDoc(collection(db, "tasks"), newTask);
                const addedTask = { id: docRef.id, ...newTask };

                this.tasks.push(addedTask);
                this.updateStructuredTasks();
                this.debounceSave();
            } catch (error) {
                console.error("Error adding task:", error.message);
            } finally {
                this.loadingDoc = false;
            }
        },

        async deleteTask(taskId) {
            this.loadingDoc = true;
            try {
                await deleteDoc(doc(db, "tasks", taskId));
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.updateStructuredTasks();
                this.debounceSave();
            } catch (error) {
                console.error("Error deleting task:", error.message);
            } finally {
                this.loadingDoc = false;
            }
        },

        async updateTask(taskId, updatedFields) {
            this.loadingDoc = true;
            try {
                const taskRef = doc(db, "tasks", taskId);
                await updateDoc(taskRef, updatedFields);

                const index = this.tasks.findIndex(task => task.id === taskId);
                if (index !== -1) {
                    Object.assign(this.tasks[index], updatedFields);
                    this.updateStructuredTasks();
                    this.debounceSave();
                }
            } catch (error) {
                console.error("Error updating task:", error.message);
            } finally {
                this.loadingDoc = false;
            }
        },

        async updateTasksOrder() {
            const batch = writeBatch(db);
            const saveTaskRecursively = (task, parentId = null) => {
                const taskRef = doc(db, "tasks", task.id);
                batch.update(taskRef, { parentId });
                task.children.forEach(child => saveTaskRecursively(child, task.id));
            };

            this.structuredTasks.forEach(rootTask => saveTaskRecursively(rootTask));
            await batch.commit();
        },

        debounceSave() {
            if (this.updateTimeout) clearTimeout(this.updateTimeout);
            this.updateTimeout = setTimeout(async () => {
                await this.updateTasksOrder();
                this.updateTimeout = null;
            }, 1000); // Adjust debounce time as needed
        }
    }
});
