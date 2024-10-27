<template>
  <a-layout>
    <a-layout-header v-if="!userStore.loadingSession">
      <a-menu theme="dark" mode="horizontal" :style="{lineHeight: '64px'}" v-model:selectedKeys="selectedKeys">
        <a-menu-item key="home"       v-if="userStore.userData"><router-link to="/">Home</router-link></a-menu-item>
        <a-menu-item key="perfil"     v-if="userStore.userData"><router-link to="/perfil">Perfil</router-link></a-menu-item>
        <a-menu-item key="login"      v-if="!userStore.userData"><router-link to="/login">Login</router-link></a-menu-item>
        <a-menu-item key="register"   v-if="!userStore.userData"><router-link to="/register">Register</router-link></a-menu-item>
        <a-menu-item key="logout"     @click="userStore.logoutUser" v-if="userStore.userData">Logout</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding:0 50px;">
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }"  class="full-h">
        <div v-if="userStore.loadingSession">
          Loading...
        </div>
        <router-view v-else></router-view>
      </div>
    </a-layout-content>
  </a-layout>
</template>


<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from './stores/user';
import { useRoute } from 'vue-router'
const userStore = useUserStore()
const route = useRoute()
const selectedKeys = ref([route.name])
watch(
  //que quiero mirar
  () => route.name,
  //que quiero hacer
  () => {selectedKeys.value = [route.name]}
)


</script>

<style>
/*
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 2s;
}
*/

body{
    margin: 0 !important;
}

.full-h{
    min-height: calc(100vh - 64px) !important;
}
</style>