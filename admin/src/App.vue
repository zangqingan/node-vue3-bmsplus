<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Home from '@/pages/Home.vue';
import About from '@/pages/About.vue';
import Login from '@/pages/Login.vue';
    component:{
      About
      Home
      Login
    }
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $test-color;
  margin-top: 60px;
}
</style>
