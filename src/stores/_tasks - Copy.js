import { db } from "@/firebaseConfig";
import {
    collection, addDoc, getDocs, doc, updateDoc, deleteDoc, writeBatch,
} from "firebase/firestore/lite";
import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", {
    state: () => ({
        tasks: [],  // Flat array of all tasks
        structuredTasks: [],  // Nested tasks structure
        loadingDoc: false,
        loadingUpdateOrder: false,
        updateTimeout: null,  // Timeout reference for debouncing
    }),
    actions: {
        async getAllTasks() {
            this.loadingDoc = true;
            try {
                const querySnapshot = await getDocs(collection(db, "tasks"));
                this.tasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    children: [] // Initialize children as an empty array
                }));
                this.structuredTasks = this.structureTasks(this.tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error.message);
            } finally {
                this.loadingDoc = false;
            }
        },

        structureTasks(tasks) {
            const taskMap = {};
            const structured = [];

            tasks.forEach(task => {
                taskMap[task.id] = { ...task, children: [] };
            });

            tasks.forEach(task => {
                if (task.parentId) {
                    taskMap[task.parentId]?.children.push(taskMap[task.id]);
                } else {
                    structured.push(taskMap[task.id]);
                }
            });

            return structured;
        },

        async saveStructuredTasks() {
            if (this.updateTimeout) clearTimeout(this.updateTimeout);

            this.updateTimeout = setTimeout(async () => {
                this.loadingDoc = true;
                try {
                    const batch = writeBatch(db);
                    const saveTaskRecursively = (task, parentId = null) => {
                        const taskRef = doc(db, "tasks", task.id);
                        batch.update(taskRef, {
                            parentId,
                            desc: task.desc,
                            createdAt: task.createdAt,
                        });
                        task.children.forEach(child => saveTaskRecursively(child, task.id));
                    };

                    this.structuredTasks.forEach(rootTask => saveTaskRecursively(rootTask));
                    await batch.commit();
                } catch (error) {
                    console.error("Error saving structured tasks:", error);
                } finally {
                    this.loadingDoc = false;
                    this.updateTimeout = null;
                }
            }, 1000); // Adjust debounce time as needed
        },

       

        async addTask(desc, parentId = null) {
            this.loadingDoc = true;
            try {
                const newTask = {
                    desc,
                    createdAt: new Date(),
                    parentId,
                };
                const docRef = await addDoc(collection(db, "tasks"), newTask);
                const addedTask = { id: docRef.id, ...newTask };

                this.tasks.push(addedTask);
                this.structuredTasks = this.structureTasks(this.tasks);
                await this.saveStructuredTasks();
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
                this.structuredTasks = this.structureTasks(this.tasks);
                await this.saveStructuredTasks();
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
                    this.structuredTasks = this.structureTasks(this.tasks);
                    await this.saveStructuredTasks();
                }
            } catch (error) {
                console.error("Error updating task:", error.message);
            } finally {
                this.loadingDoc = false;
            }
        },
        async updateTasksOrder(taskId, parentId) {
            //this.tasks = newOrder;
            console.log('taskId',taskId);
            console.log('parentId',parentId);

            //console.log('parentId',parentId);
            //this.tasks.filter(item => item.id == taskId);
            // Update local Pinia state for real-time UI feedback
            const taskIndex = this.tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                let newParentId = this.tasks[taskIndex].parentId;
                // Rebuild structuredTasks to reflect the new hierarchy
                this.structuredTasks = this.structureTasks(this.tasks);
                //await this.saveStructuredTasks();
            }

            /*
            // Debounce Firestore update to prevent excessive writes
            if (this.updateTimeout) clearTimeout(this.updateTimeout);

            this.updateTimeout = setTimeout(async () => {
                this.loadingUpdateOrder = true; // Set loading flag to show UI loading state

                try {
                    const taskRef = doc(db, "tasks", taskId);
                    await updateDoc(taskRef, { parentId: newParentId }); // Write the updated parentId to Firestore
                } catch (error) {
                    console.error("Error updating task parentId in Firestore:", error);
                } finally {
                    this.loadingUpdateOrder = false; // Reset loading flag
                    this.updateTimeout = null; // Clear the debounce reference
                }
            }, 1000); // Adjust debounce time as 
            */
        },
        
    },
});
