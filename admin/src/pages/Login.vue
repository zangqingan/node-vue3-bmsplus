<script setup lang="ts">
import { reactive } from 'vue';
import {login} from '@/api/login/login.js'
const loginForm = reactive({
  username: '',
  password: ''
})
const Login = async () => {
  const data = await login(loginForm)
  console.log(data);
}
</script>
<template>
  <input v-model="loginForm.username" />
  <input v-model="loginForm.password" type="password" />
  <button @click="Login">登录</button>
</template>