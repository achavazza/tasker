import { defineStore } from "pinia";
import { auth, db, storage } from "@/firebaseConfig";
import { 
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";

import router from '@/router/index.js';
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useDatabaseStore } from "./database";

export const useUserStore = defineStore("userStore",{
    state:()=>({
        userData: null,
        loadingUser: false,
        loadingSession: false,
    }),
    getters:{
        minuscula(state) {
            return state.userData.toLowerLowerCase()
        }
    },
    actions:{
        async registerUser(email,password) {
            this.loadingUser = true;
            //this.userData = name;
            try {
                const { user } = await createUserWithEmailAndPassword(auth, email, password)
                this.userData = {email: user.email, uid:user.uid}
                router.push('/');
                console.log(user);
                
            } catch (error){
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        /*
        async updateImg(imagen){
            try {
                const storageRef = ref(storage, `perfiles/${this.userData.uid}`);
                await uploadBytes (storageRef, imagen.originFileObj);
                
                const url = await getDownloadURL(storageRef);
                await updateProfile(auth.currentUser, {
                    photoURL: url
                });
                this.setUser(auth.currentUser);
                console.log(url);
            } catch (error) {
                console.log(error);
                return error.code;
            }
        },*/
        async updateUser(displayName, imagen){
            try {
                if(imagen){
                    const storageRef = ref(storage, `perfiles/${this.userData.uid}`);
                    await uploadBytes(storageRef, imagen.originFileObj);

                    const url = await getDownloadURL(storageRef);
                    await updateProfile(auth.currentUser, {
                        photoURL: url
                    });
                }
                await updateProfile(auth.currentUser, {
                    displayName: displayName
                });
                this.setUser(auth.currentUser);
            } catch (error) {
                console.log(error);
                return error.code;
            }
        },
        async setUser(user) {
            try {
                const docRef = doc(db, 'users', user.uid);
                //const docSpan = await getDoc(docRef);

                this.userData = {
                    email: user.email,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                }

                await setDoc(docRef, this.userData);
                /*
                if (docSpan.exists()) {
                    //his.userData = { email: user.email, uid: user.uid }
                    this.userData = { ...docSpan.data() }
                } else {
                    await setDoc(docRef, {
                        email: user.email,
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    });

                    this.userData = {
                        email: user.email,
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    }
                }*/
            } catch (error) {
                
            }
        },
        async loginUser(email, password) {
            this.loadingUser = true;
            try {
                const {user} = await signInWithEmailAndPassword(auth, email, password);
                await this.setUser(user);
                router.push('/');
                console.log(user);

            } catch (error) {

                console.log(error.code);
                return error.code;
                
            } finally {
                this.loadingUser = false;
            }
        },
        async logoutUser() {
            try {
                router.push('/login');
                await signOut(auth);
                //this.userData = null;
            } catch (error) {
                console.log(error);
            }
        },

        currentUser() {
            return new Promise((resolve, reject) => {
                const unsuscribe = onAuthStateChanged(
                    auth,
                    async (user) => {
                        if (user) {
                            console.log(user);
                            //await this.setUser(user);
                            this.userData = {
                                email: user.email,
                                uid: user.uid,
                                displayName: user.displayName,
                                photoURL: user.photoURL
                            }
                        } else {
                            this.userData = null;
                            const databaseStore = useDatabaseStore();
                            databaseStore.$reset();
                        }
                        resolve(user);
                    },
                    (e) => reject(e)
                );
                return unsuscribe;
            });
        },
    }
})