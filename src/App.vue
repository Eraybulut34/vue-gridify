<template>
  <div class="app">
    <h1>Vue Gridify Demo</h1>
    <VueGridify 
      :enable-excel-export="true"
      :columns="gridColumns"
      :data="gridData"
      :page-size="5"
      :selectable="true"
      @selection-changed="handleSelectionChanged"
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
  { id: 4, name: 'Zeynep Çelik', email: 'zeynep@ornek.com' },
  { id: 5, name: 'Fatma Yiğit', email: 'fatma@ornek.com' },
  { id: 6, name: 'Bülent Çetin', email: 'bulent@ornek.com' },
  { id: 7, name: 'Cemal Kılıç', email: 'cemal@ornek.com' },
  { id: 8, name: 'Serdar Çakır', email: 'serdar@ornek.com' },
  { id: 9, name: 'Hatice Özkan', email: 'hatice@ornek.com' },
  { id: 10, name: 'Merve Aksoy', email: 'merve@ornek.com' },
  { id: 11, name: 'Ersin Yıldırım', email: 'ersin@ornek.com' },
  { id: 12, name: 'Sibel Akın', email: 'sibel@ornek.com' },
  { id: 13, name: 'Mehmet Eryılmaz', email: 'mehmet@ornek.com' },
  { id: 14, name: 'Gülşen Yılmaz', email: 'gulse@ornek.com' },
  { id: 15, name: 'Burak Yılmaz', email: 'burak@ornek.com' },
  { id: 16, name: 'Sümeyra Yılmaz', email: 'sumeyra@ornek.com' },
  { id: 17, name: 'Fatma Yılmaz', email: 'fatma@ornek.com' },
  { id: 18, name: 'Ayşe Yılmaz', email: 'ayse@ornek.com' },
  { id: 19, name: 'Mehmet Yılmaz', email: 'mehmet@ornek.com' },
  { id: 20, name: 'Ahmet Yılmaz', email: 'ahmet@ornek.com' },
  { id: 21, name: 'Merve Yılmaz', email: 'merve@ornek.com' },
  { id: 22, name: 'Cemal Yılmaz', email: 'cemal@ornek.com' },
  { id: 23, name: 'Serdar Yılmaz', email: 'serdar@ornek.com' },
  { id: 24, name: 'Hatice Yılmaz', email: 'hatice@ornek.com' },
  { id: 25, name: 'Ersin Yılmaz', email: 'ersin@ornek.com' },
  { id: 26, name: 'Sibel Yılmaz', email: 'sibel@ornek.com' },
  { id: 27, name: 'Mehmet Yılmaz', email: 'mehmet@ornek.com' },
  { id: 28, name: 'Gülşen Yılmaz', email: 'gulse@ornek.com' },
  { id: 29, name: 'Burak Yılmaz', email: 'burak@ornek.com' },
  { id: 30, name: 'Sümeyra Yılmaz', email: 'sumeyra@ornek.com' },
  { id: 31, name: 'Fatma Yılmaz', email: 'fatma@ornek.com' },
  { id: 32, name: 'Ayşe Yılmaz', email: 'ayse@ornek.com' },
  { id: 33, name: 'Mehmet Yılmaz', email: 'mehmet@ornek.com' },
  { id: 34, name: 'Ahmet Yılmaz', email: 'ahmet@ornek.com' },
  { id: 35, name: 'Merve Yılmaz', email: 'merve@ornek.com' },
  { id: 36, name: 'Cemal Yılmaz', email: 'cemal@ornek.com' },
  { id: 37, name: 'Serdar Yılmaz', email: 'serdar@ornek.com' },
  { id: 38, name: 'Hatice Yılmaz', email: 'hatice@ornek.com' },
  { id: 39, name: 'Ersin Yılmaz', email: 'ersin@ornek.com' },
  { id: 40, name: 'Sibel Yılmaz', email: 'sibel@ornek.com' },
  { id: 41, name: 'Mehmet Yılmaz', email: 'mehmet@ornek.com' },
  { id: 42, name: 'Gülşen Yılmaz', email: 'gulse@ornek.com' },
]

const handleSelectionChanged = (selection: GridData[]) => {
  console.log(selection)
}
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style> 