<template>
  <div class="vue-gridify-container">
    <table class="vue-gridify-table">
      <thead>
        <tr>
          <th 
            v-for="column in props.columns" 
            :key="column.field"
            :class="{ 
              'vue-gridify-th': true,
              'resizable': column.resizable 
            }"
          >
            {{ column.header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in visibleData" :key="row.id">
          <td 
            v-for="column in props.columns" 
            :key="column.field"
          >
            {{ row[column.field] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GridColumn, GridData } from '../types'

interface Props {
  columns: GridColumn[]
  data: GridData[]
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10
})

const currentPage = ref(1)
const visibleData = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return props.data.slice(start, end)
})
</script>

<style scoped lang="scss">
.vue-gridify {
  &-container {
    width: 100%;
    overflow: auto;
  }

  &-table {
    width: 100%;
    border-collapse: collapse;
  }

  &-th {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 2px solid #e2e8f0;
    
    &.resizable {
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 25%;
        height: 50%;
        width: 4px;
        background-color: #e2e8f0;
        cursor: col-resize;
      }
    }
  }
}
</style> 