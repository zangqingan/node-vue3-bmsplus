import { defineStore } from 'pinia'
export const mainStore = defineStore({
    id: 'index',
    state: () =>({
        name: '超级管理员'
    }),
     // getters
    getters: {
        nameLength: (state) => state.name.length,
        token: (state) => state.name.length,
    }
    
})