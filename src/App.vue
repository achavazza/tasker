<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible v-if="!userStore.loadingSession">
      <a-menu theme="dark" :style="{lineHeight: '64px'}" v-model:selectedKeys="selectedKeys">
        <a-menu-item key="home"       v-if="userStore.userData"><router-link to="/"><HomeOutlined /><span> Home</span></router-link></a-menu-item>
        <a-menu-item key="perfil"     v-if="userStore.userData"><router-link to="/perfil"><user-outlined /><span> Perfil</span></router-link></a-menu-item>
        <a-menu-item key="login"      v-if="!userStore.userData"><router-link to="/login"><user-outlined /><span> Login</span></router-link></a-menu-item>
        <a-menu-item key="register"   v-if="!userStore.userData"><router-link to="/register"><user-outlined /><span> Register</span></router-link></a-menu-item>
        <a-menu-item key="logout"     @click="userStore.logoutUser" v-if="userStore.userData"><LogoutOutlined /><span> Logout</span></a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
       <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
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
</a-layout>
</template>


<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from './stores/user';
import { useRoute } from 'vue-router'
const userStore = useUserStore()
const route = useRoute()
const selectedKeys = ref([route.name])
const collapsed = ref(false);
watch(
  //que quiero mirar
  () => route.name,
  //que quiero hacer
  () => {selectedKeys.value = [route.name]}
)

import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';
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
.ant-layout-has-sider .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.ant-layout-has-sider .trigger:hover {
  color: #1890ff;
}

.ant-layout-has-sider .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
.ant-menu-inline-collapsed .ant-menu span{
  display:none;
}
</style>