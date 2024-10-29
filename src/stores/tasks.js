import { db } from "@/firebaseConfig"
import { getAuth } from "firebase/auth";
import { collection, where, addDoc, setDoc, doc, getDoc, getDocs, query, deleteDoc, updateDoc } from "firebase/firestore/lite";
import { defineStore } from "pinia";

import router from '@/router/index.js';
import { nanoid } from "nanoid";

export const useTaskStore = defineStore('task', {
    state: () => ({
        documents: [],
        loadingDoc: false,
    }),
    actions: {
        async getTasks() {
            //si hay data en cache no pida
            if (this.documents.length !== 0) {
                return
            }
            this.loadingDoc = true;
            try {
                const auth = getAuth();
                const q = query(collection(db, 'tasks'), where('user', '==', auth.currentUser.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(doc => {
                    // console.log(doc.id, doc.data());
                    this.documents.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                //console.log(this.documents);
            } catch (error) {
                console.log(error.code);
            } finally {
                this.loadingDoc = false;
            }
        },
        async addTask(desc) {
            this.loadingDoc = true;
            try {
                const auth = getAuth();
                const objetoDoc = {
                    desc: desc,
                    short: nanoid(6),
                    user: auth.currentUser.uid,
                };
                // cambio la logica a asignar un id propio usando nano
                //console.log(objetoDoc);
                await setDoc(doc(db, "tasks", objetoDoc.short), objetoDoc);
                this.documents.push({
                    ...objetoDoc,
                    id: objetoDoc.short
                });
            } catch (error) {

            } finally {
                this.loadingDoc = false;
            }
        },
        async getTask(id) {
            try {
                const docRef = doc(db, 'tasks', id);
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    return false
                }
                return docSnap.data().desc

            } catch (error) {
                return false
            } finally {

            }
        },
        async readTask(id) {
            try {
                const auth = getAuth();
                const docRef = doc(db, 'tasks', id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    throw new Error("No existe el doc")
                }
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("No le pertenece ese documento")
                }

                return docSnap.data()

            } catch (error) {
                console.log(error)
            } finally {

            }
        },
        async updateTask(id, data) {
            try {
                const auth    = getAuth();
                const docRef  = doc(db, 'tasks', id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    throw new Error("No existe el doc")
                }
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("No le pertenece ese documento")
                }

                 
                await updateDoc(docRef, data)

                //map devuelve el total de elementos del array, si o si, por positva o negativa, no cambia el tamaño del array
                this.documents = this.documents.map(item => item.id === id ? ({ ...item, desc: desc }) : item)
                router.push('/')

            } catch (error) {
                console.log(error)
            } finally {

            }
        },
        async deleteTask(id) {
            this.loadingDoc = true;
            try {
                const auth = getAuth();
                const docRef = doc(db, 'tasks', id);

                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    throw new Error("No existe el doc")
                }
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("No le pertenece ese documento")
                }
                await deleteDoc(docRef);
                this.documents = this.documents.filter(item => item.id !== id);
            } catch (error) {
                return error.message;
            } finally {
                this.loadingDoc = false;
            }
        }
    }
});