import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { useDatabaseStore } from '@/stores/database.js'

import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Editar from "@/views/Editar.vue";
import Ver from "@/views/Ver.vue";
import Register from "@/views/Register.vue";
import Perfil from "@/views/Perfil.vue";
import NotFound from '@/views/NotFound.vue';


//middleware con una promesa para esperar y chequear el login de usuario
const requireAuth = async (to, from, next) =>{
  const userStore = useUserStore();  
  userStore.loadingSession = true;
  const user = await userStore.currentUser();
  if(user){
    next();
    console.log('entro');
  }else{
    //next('/login');
    console.log('no entro');
  }
  userStore.loadingSession = false;
}

const redireccion = async(to, from, next) =>{
  console.log(to.params.pathMatch[0]);
  const databaseStore = useDatabaseStore();  
  const userStore = useUserStore();
  userStore.loadingSession = true;
  const name = await databaseStore.getURL(to.params.pathMatch[0]);
  if (!name){
    next()
    userStore.loadingSession = false;
  }else{
    window.location.href = name;
    userStore.loadingSession = true;
    next();
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: Home, beforeEnter: requireAuth, name:'home' },
    { path: "/editar/:id", component: Editar, beforeEnter: requireAuth, name: 'edit' },
    { path: "/ver/:id", component: Ver, beforeEnter: requireAuth, name: 'ver' },
    { path: "/login", component: Login, name: 'login' },
    { path: "/register", component: Register, name: 'register' },
    { path: "/perfil", component: Perfil, beforeEnter: requireAuth, name: 'perfil' },
    { path: "/:pathMatch(.*)*", component: NotFound, name: '404', beforeEnter: redireccion },
  ]
})

export default router
