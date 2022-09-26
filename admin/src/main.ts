import { createApp } from 'vue'
import App from './App.vue'
// 引入路由
import router from './router/index'
// 状态管理pinia
import {createPinia} from 'pinia'
const pinia = createPinia()
createApp(App).use(router).use(pinia).mount('#app')
