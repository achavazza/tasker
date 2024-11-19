<template>
<div id="hs-application-sidebar" class="
    h-full
    inset-y-0 start-0 z-[60]
    bg-white border-e border-gray-200
    dark:bg-neutral-800 dark:border-neutral-700" role="dialog" tabindex="-1" aria-label="Sidebar">
    <div class="relative flex flex-col h-full max-h-full">
      <!-- Content -->
      <div class="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        <nav class="hs-accordion-group p-3 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
          <ul class="flex flex-col space-y-1">
            <li v-if="userStore.userData">
                <router-link to="/" class="w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-300">
                Home</router-link>
            </li>

            <li v-if="userStore.userData">
                <router-link to="/perfil" class="p-2 flex items-center text-sm bg-gray-100 text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                Perfil</router-link>
            </li>

            <li v-if="!userStore.userData">
                <router-link to="/login" class="p-2 flex items-center text-sm bg-gray-100 text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                Login</router-link>
            </li>

            <li v-if="!userStore.userData">
                <router-link to="/register" class="p-2 flex items-center text-sm bg-gray-100 text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                Register</router-link>
            </li>

            <li v-if="userStore.userData">
                <a class="py-[7px] px-2.5 inline-flex items-center font-medium text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 focus:outline-none focus:bg-gray-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#"
                @click="userStore.logoutUser" >
                Logout</a>
            </li>
          
          </ul>
        </nav>
      </div>
      <!-- End Content -->
    </div>
</div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router'
const userStore = useUserStore()
const route = useRoute()
</script>