<template>
  <div class="app">
    <h1>Vue Gridify Demo</h1>
    <VueGridify 
      :columns="gridColumns"
      :data="gridData"
      :page-size="5"
    />
  </div>
</template>

<script setup lang="ts">
import VueGridify from './components/VueGridify.vue'
import type { GridColumn, GridData } from './types'

const gridColumns: GridColumn[] = [
  { field: 'id', header: 'ID', resizable: true },
  { field: 'name', header: 'İsim', resizable: true },
  { field: 'email', header: 'E-posta', resizable: true },
]

const gridData: GridData[] = [
  { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@ornek.com' },
  { id: 2, name: 'Ayşe Demir', email: 'ayse@ornek.com' },
  { id: 3, name: 'Mehmet Kaya', email: 'mehmet@ornek.com' },
]
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style> 