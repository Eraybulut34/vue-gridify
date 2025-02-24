<template>
  <div class="vue-gridify-container">
    <div v-if="props.enableExcelExport" class="vue-gridify-toolbar">
      <button class="vue-gridify-export-btn" @click="exportToExcel">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        {{ props.exportButtonText }}
      </button>
    </div>
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
import * as XLSX from 'xlsx'

interface Props {
  columns: GridColumn[]
  data: GridData[]
  pageSize?: number
  enableExcelExport?: boolean
  exportButtonText?: string
  fileName?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10,
  enableExcelExport: true,
  exportButtonText: "Excel'e Aktar",
  fileName: 'grid-data'
})

const currentPage = ref(1)
const visibleData = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return props.data.slice(start, end)
})

const exportToExcel = () => {
  // Tüm veriyi al (sayfalama olmadan)
  const data = props.data.map(row => {
    const newRow: Record<string, any> = {}
    props.columns.forEach(col => {
      newRow[col.header] = row[col.field]
    })
    return newRow
  })

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  
  // Excel dosyasını indir
  XLSX.writeFile(wb, `${props.fileName}.xlsx`)
}
</script>

<style scoped lang="scss">
.vue-gridify {
  &-container {
    width: 100%;
    overflow: auto;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #cbd5e1;
  }

  &-toolbar {
    padding: 1rem;
    border-bottom: 1px solid #cbd5e1;
    display: flex;
    justify-content: flex-end;
  }

  &-export-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #059669;
    }

    svg {
      width: 1rem;
      height: 1rem;
    }
  }

  &-table {
    width: 100%;
    border-collapse: collapse;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  &-th {
    padding: 1rem;
    text-align: left;
    background: #f8fafc;
    color: #1e293b;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid #cbd5e1;
    transition: background-color 0.2s ease;
    
    &.resizable {
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 25%;
        height: 50%;
        width: 4px;
        background-color: #cbd5e1;
        cursor: col-resize;
        transition: background-color 0.2s ease;
      }

      &:hover::after {
        background-color: #94a3b8;
      }
    }

    &:hover {
      background: #f1f5f9;
    }
  }


}

tbody {
    tr {
      transition: all 0.2s ease;

      &:hover {
        background-color: #f8fafc;
      }

      td {
        padding: 0.875rem 1rem;
        border: 1px solid #cbd5e1;
        color: #334155;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
    }
  }
</style>