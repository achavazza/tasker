//import { authGuard } from "@/guards/auth"
import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import SignInView from "@/views/SignInView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView,
      meta: { authRequired: false },
      name: 'home',
    },
    {
      path: "/sign-in",
      component: SignInView,
      meta: { authRequired: false },
      name: 'sign-in',
    },
   /* {
      path: "/profile",
      name: "Profile",
      meta: { authRequired: true },
      component: () => import("../views/ProfileView.vue")
    }*/
  ]
})

//router.beforeEach(authGuard)

export default router
