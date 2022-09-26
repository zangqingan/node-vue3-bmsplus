// 引入路由创建的相关方法
import {createRouter,createWebHistory,RouteRecordRaw} from 'vue-router'
// 定义一些路由,每个路由都需要映射到一个组件。
const routes:RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/Home.vue'), // 注意这里要带上 文件后缀.vue
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('@/pages/About.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/Login.vue'),
    },

]
// 创建路由实例并传递 `routes` 配置
const router = createRouter({
    history:createWebHistory(),
    routes
})
// 导出
export default router