import { getAuth } from "firebase/auth";
import { collection, where, addDoc, setDoc, doc, getDoc, getDocs, query, deleteDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "@/firebaseConfig"
import { defineStore } from "pinia";

import router from '@/router/index.js';
import { nanoid } from "nanoid";

export const useDatabaseStore = defineStore('database',{
    state: () => ({
        documents: [],
        loadingDoc: false,
    }),
    actions: {
        async getUrls(){

            //si hay data en cache no pida
            if(this.documents.length !== 0){
                return
            }

            this.loadingDoc = true;
            try {
                const auth = getAuth();
                //console.log(auth.currentUser.uid);
                const q = query(collection(db, 'urls'), where('user', '==', auth.currentUser.uid ));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(doc => {
                    // console.log(doc.id, doc.data());
                    this.documents.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                
            } catch (error) {
                console.log(error.code);
            } finally {
                this.loadingDoc = false;
            }
        },
        async addUrl(name) {
            this.loadingDoc = true;
            try {
                const auth = getAuth();
                const objetoDoc = {
                    name: name,
                    short: nanoid(6),
                    user: auth.currentUser.uid,
                };
                /*
                //el id se lo agrega firebase con addDoc
                const docRef = await addDoc(collection(db, "urls"), objetoDoc);
                this.documents.push({
                    ...objetoDoc,
                    id: docRef.id
                });
                */
                // cambio la logica a asignar un id propio usando nano
                await setDoc(doc(db, "urls", objetoDoc.short), objetoDoc);
                this.documents.push({
                    ...objetoDoc,
                    id: objetoDoc.short
                });
            } catch (error) {
                
            }finally{
                this.loadingDoc = false;   
            }
        },
        async getURL(id) {
            try {
                const docRef = doc(db, 'urls', id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                   return false
                }
                
                return docSnap.data().name
                
            } catch (error) {
                return false
            } finally {

            }
        },
        async leerURL(id){
            try {
                const auth = getAuth();
                const docRef = doc(db, 'urls', id);
                const docSnap = await getDoc(docRef);
                
                if (!docSnap.exists()) {
                    throw new Error("No existe el doc")
                }
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("No le pertenece ese documento")
                }
                
                return docSnap.data().name

            } catch (error) {
                console.log(error)
            }finally{

            }
        },
        async updateURL(id, name){
            try {
                const auth = getAuth();
                const docRef = doc(db, 'urls', id);
                const docSnap = await getDoc(docRef);
                
                if (!docSnap.exists()) {
                    throw new Error("No existe el doc")
                }
                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("No le pertenece ese documento")
                }

                await updateDoc(docRef, {
                    name: name
                })

                //map devuelve el total de elementos del array, si o si, por positva o negativa, no cambia el tamaño del array
                this.documents = this.documents.map(item => item.id === id ? ({...item, name:name}) : item )
                
                router.push('/')
                //return docSnap.data().name

            } catch (error) {
                console.log(error)
            }finally{

            }
        },
        async deleteURL(id){
            this.loadingDoc = true;
            try {
                const auth = getAuth();
                const docRef = doc(db, 'urls', id);
                
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()){
                    throw new Error("No existe el doc")
                }
                if (docSnap.data().user !== auth.currentUser.uid){
                    throw new Error("No le pertenece ese documento")
                }
                
                await deleteDoc(docRef);
                this.documents = this.documents.filter(item => item.id !== id);
            } catch (error) {
                //console.log(error.code);
                return error.message;
            }finally{
                this.loadingDoc = false;
            }
        }
    }
});