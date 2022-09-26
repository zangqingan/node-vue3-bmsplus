<script setup lang="ts">
import { ref } from 'vue'
// pinia
import {mainStore} from '@/store/index'
const store = mainStore()

const count = ref(0)
</script>

<template>
  <h4>pinia</h4>
  <p>{{store.name}}</p>
 
</template>
