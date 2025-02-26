<template>
  <div class="vue-gridify-container">
    <div v-if="enableExcelExport" class="vue-gridify-toolbar">
      <div v-if="selectable" class="vue-gridify-selection-info">
        {{ selectedRows.length }} rows selected
      </div>
      <div class="vue-gridify-toolbar-actions">
        <button class="vue-gridify-export-btn" @click="exportToExcel">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {{ exportButtonText }}
        </button>
      </div>
    </div>

    <div class="vue-gridify-table-container">
      <table class="vue-gridify-table" :class="{ resizing: isResizing }">
        <thead>
          <tr>
            <th v-if="selectable" class="vue-gridify-checkbox-cell vue-gridify-th">
              <label class="vue-gridify-checkbox">
                <input 
                  type="checkbox" 
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="toggleSelectAll"
                >
                <span class="vue-gridify-checkbox-checkmark"></span>
              </label>
            </th>
            <th 
              v-for="column in columns" 
              :key="column.field"
              :class="{ 
                'vue-gridify-th': true,
                'resizable': column.resizable 
              }"
              :style="column.resizable ? { width: columnWidths[column.field] } : {}"
              @mousedown="column.resizable ? startResize($event, column.field) : null"
              :title="column.header"
            >
              {{ column.header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in serverSide ? data : paginatedItems" 
            :key="row.id"
            :class="rowClass"
          >
            <td v-if="selectable" class="vue-gridify-checkbox-cell">
              <label class="vue-gridify-checkbox">
                <input 
                  type="checkbox" 
                  :checked="isSelected(row)"
                  @change="toggleSelect(row)"
                >
                <span class="vue-gridify-checkbox-checkmark"></span>
              </label>
            </td>
            <td 
              v-for="column in columns" 
              :key="column.field"
              :class="cellClass"
              :style="column.resizable ? { width: columnWidths[column.field] } : {}"
              :title="row[column.field]"
            >
              {{ row[column.field] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="vue-gridify-pagination">
      <div class="vue-gridify-pagination-info">
        Showing {{ paginationState.startIndex }} to {{ paginationState.endIndex }} of {{ paginationState.totalItems }} entries
      </div>
      
      <div class="vue-gridify-pagination-controls">
        <button 
          :disabled="paginationState.isFirstPage"
          @click="firstPage"
          class="vue-gridify-pagination-btn"
        >
          First
        </button>
        
        <button 
          :disabled="!paginationState.hasPrevPage"
          @click="prevPage"
          class="vue-gridify-pagination-btn"
        >
          Previous
        </button>

        <button 
          v-for="page in pageNumbers"
          :key="page"
          @click="setPage(page)"
          :class="[
            'vue-gridify-pagination-btn',
            { active: page === paginationState.currentPage }
          ]"
        >
          {{ page }}
        </button>

        <button 
          :disabled="!paginationState.hasNextPage"
          @click="nextPage"
          class="vue-gridify-pagination-btn"
        >
          Next
        </button>

        <button 
          :disabled="paginationState.isLastPage"
          @click="lastPage"
          class="vue-gridify-pagination-btn"
        >
          Last
        </button>
      </div>

      <div class="vue-gridify-page-size">
        <select 
          :value="paginationState.pageSize"
          @change="(e: Event) => {
            const target = e.target as HTMLSelectElement;
            setPageSize(Number(target.value))
          }"
          class="vue-gridify-select"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }} per page
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import type { GridColumn, GridData } from '../types'
import * as XLSX from 'xlsx'
import { usePagination } from '../composables/usePagination'

interface Props {
  columns: GridColumn[]
  data: GridData[]
  pageSize?: number
  pageSizeOptions?: number[]
  enableExcelExport?: boolean
  exportButtonText?: string
  fileName?: string
  selectable?: boolean
  selectedRows?: GridData[]
  totalItems?: number
  serverSide?: boolean
  loading?: boolean
  rowClass?: string
  cellClass?: string
}

interface Emits {
  (e: 'selection-changed', rows: GridData[]): void
  (e: 'page-changed', page: number, pageSize: number): void
}

const emit = defineEmits<Emits>()

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10,
  pageSizeOptions: () => [5, 10, 20, 50, 100],
  enableExcelExport: false,
  exportButtonText: "Export to Excel",
  fileName: 'grid-data',
  selectable: false,
  selectedRows: () => [],
  totalItems: 0,
  serverSide: false,
  loading: false,
  rowClass: '',
  cellClass: ''
})

// Dahili olarak kullanılacak data referansı
const internalData = ref<GridData[]>([...props.data])

// Props'tan gelen data değişikliklerini izle
watch(() => props.data, (newData) => {
  internalData.value = [...newData]
}, { immediate: true })

const {
  paginatedItems,
  pageNumbers,
  paginationState,
  setPage,
  nextPage,
  prevPage,
  firstPage,
  lastPage,
  setPageSize,
  updateTotalItems
} = usePagination(internalData.value, {
  pageSize: props.pageSize,
  totalItems: props.totalItems || props.data.length,
  serverSide: props.serverSide
})

// Server-side pagination için totalItems değişikliklerini izle
watch(() => props.totalItems, (newTotalItems) => {
  if (props.serverSide && newTotalItems !== undefined) {
    updateTotalItems(newTotalItems)
  }
}, { immediate: true })

// Watch page changes for server-side pagination
watch([() => paginationState.value.currentPage, () => paginationState.value.pageSize], ([newPage, newPageSize]) => {
  if (props.serverSide) {
    emit('page-changed', newPage, newPageSize)
  }
})

// Seçilen satırları yönet
const selectedRowsRef = ref<GridData[]>(props.selectedRows || [])

// Props'tan gelen selectedRows değişikliklerini izle
watch(() => props.selectedRows, (newSelectedRows) => {
  if (newSelectedRows) {
    selectedRowsRef.value = newSelectedRows
  }
}, { immediate: true })

// Bir satırın seçili olup olmadığını kontrol et
const isSelected = (row: GridData) => {
  return selectedRowsRef.value.some(selectedRow => selectedRow.id === row.id)
}

const isAllSelected = computed(() => {
  const items = props.serverSide ? props.data : paginatedItems.value
  return items.length > 0 && items.every(row => isSelected(row))
})

const isIndeterminate = computed(() => {
  const items = props.serverSide ? props.data : paginatedItems.value
  return items.some(row => isSelected(row)) && !isAllSelected.value
})

// Bir satırın seçimini değiştir
const toggleSelect = (row: GridData) => {
  const isRowSelected = isSelected(row)
  if (isRowSelected) {
    selectedRowsRef.value = selectedRowsRef.value.filter(selectedRow => selectedRow.id !== row.id)
  } else {
    selectedRowsRef.value = [...selectedRowsRef.value, row]
  }
  emit('selection-changed', selectedRowsRef.value)
}

// Tüm satırların seçimini değiştir
const toggleSelectAll = () => {
  const items = props.serverSide ? props.data : paginatedItems.value
  if (isAllSelected.value) {
    // Mevcut sayfadaki tüm satırları seçimden kaldır
    selectedRowsRef.value = selectedRowsRef.value.filter(
      selectedRow => !items.some(item => item.id === selectedRow.id)
    )
  } else {
    // Mevcut sayfadaki tüm satırları seç
    const newSelectedRows = [...selectedRowsRef.value]
    items.forEach(row => {
      if (!isSelected(row)) {
        newSelectedRows.push(row)
      }
    })
    selectedRowsRef.value = newSelectedRows
  }
  emit('selection-changed', selectedRowsRef.value)
}

// Excel'e aktar
const exportToExcel = () => {
  const dataToExport = props.data.map(row => {
    const exportRow: Record<string, any> = {}
    props.columns.forEach(column => {
      exportRow[column.header] = row[column.field]
    })
    return exportRow
  })
  
  const worksheet = XLSX.utils.json_to_sheet(dataToExport)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
  XLSX.writeFile(workbook, `${props.fileName}.xlsx`)
}

// Column resizing functionality
const columnWidths = ref<Record<string, string>>({})
const isResizing = ref(false)
const currentResizeColumn = ref<string | null>(null)
const startX = ref<number>(0)
const startWidth = ref<number>(0)

// Initialize column widths from props
onMounted(() => {
  props.columns.forEach(column => {
    if (column.width) {
      columnWidths.value[column.field] = typeof column.width === 'number' 
        ? `${column.width}px` 
        : column.width
    } else if (column.resizable) {
      columnWidths.value[column.field] = '150px' // Default width
    }
  })
})

// Start column resize
const startResize = (event: MouseEvent, field: string) => {
  isResizing.value = true
  currentResizeColumn.value = field
  startX.value = event.clientX
  
  const currentWidth = columnWidths.value[field]
  startWidth.value = parseInt(currentWidth || '150px', 10)
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  
  // Prevent text selection during resize
  event.preventDefault()
}

// Handle column resize
const handleResize = (event: MouseEvent) => {
  if (!isResizing.value || !currentResizeColumn.value) return
  
  const diffX = event.clientX - startX.value
  const newWidth = Math.max(50, startWidth.value + diffX) // Minimum width of 50px
  
  columnWidths.value[currentResizeColumn.value] = `${newWidth}px`
}

// Stop column resize
const stopResize = () => {
  isResizing.value = false
  currentResizeColumn.value = null
  
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// Clean up event listeners
onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style>
.vue-gridify-container {
  width: 100%;
  overflow: auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #cbd5e1;
}

.vue-gridify-table-container {
  overflow-x: auto;
}

.vue-gridify-toolbar {
  padding: 1rem;
  border-bottom: 1px solid #cbd5e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vue-gridify-selection-info {
  color: #64748b;
  font-size: 0.875rem;
}

.vue-gridify-toolbar-actions {
  display: flex;
  gap: 0.5rem;
}

.vue-gridify-export-btn {
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
}

.vue-gridify-export-btn:hover {
  background-color: #059669;
}

.vue-gridify-export-btn svg {
  width: 1rem;
  height: 1rem;
}

.vue-gridify-table {
  width: 100%;
  border-collapse: collapse;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  table-layout: fixed; /* Bu özellik, sütun genişliklerinin doğru şekilde uygulanmasını sağlar */
}

.vue-gridify-th {
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vue-gridify-th.resizable {
  position: relative;
  user-select: none; /* Prevent text selection during resize */
}

.vue-gridify-th.resizable::after {
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

.vue-gridify-th.resizable:hover::after {
  background-color: #94a3b8;
}

.vue-gridify-th:hover {
  background: #f1f5f9;
}

.vue-gridify-table tr {
  transition: all 0.2s ease;
  height: 3rem; /* Satır yüksekliğini sabit tutar */
}

.vue-gridify-table tr:hover {
  background-color: #f8fafc;
}

.vue-gridify-table td {
  padding: 0.875rem 1rem;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-size: 0.875rem;
  line-height: 1.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 0; /* Bu özellik, text-overflow: ellipsis'in çalışması için gerekli */
  height: 3rem; /* Hücre yüksekliğini sabit tutar */
  box-sizing: border-box;
}

.vue-gridify-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-top: 1px solid #cbd5e1;
  background: #f8fafc;
  font-size: 0.875rem;
}

.vue-gridify-pagination-info {
  color: #64748b;
}

.vue-gridify-pagination-controls {
  display: flex;
  gap: 0.25rem;
}

.vue-gridify-pagination-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  background: white;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vue-gridify-pagination-btn:hover:not(:disabled) {
  background: #f1f5f9;
  color: #1e293b;
}

.vue-gridify-pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.vue-gridify-pagination-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.vue-gridify-select {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: white;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

.vue-gridify-select:focus {
  outline: none;
  border-color: #3b82f6;
  ring: 2px solid rgba(59, 130, 246, 0.5);
}

.vue-gridify-checkbox-cell {
  width: 32px;
  text-align: center;
  padding: 0.375rem !important;
}

.vue-gridify-checkbox {
  position: relative;
  display: inline-block;
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.vue-gridify-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.vue-gridify-checkbox-checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 14px;
  width: 14px;
  background-color: #fff;
  border: 1.5px solid #cbd5e1;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.vue-gridify-checkbox:hover input ~ .vue-gridify-checkbox-checkmark {
  border-color: #94a3b8;
}

.vue-gridify-checkbox input:checked ~ .vue-gridify-checkbox-checkmark {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.vue-gridify-checkbox input:indeterminate ~ .vue-gridify-checkbox-checkmark {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.vue-gridify-checkbox-checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.vue-gridify-checkbox input:checked ~ .vue-gridify-checkbox-checkmark:after {
  display: block;
  left: 4px;
  top: 1.5px;
  width: 3px;
  height: 6px;
  border: solid white;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
}

.vue-gridify-checkbox input:indeterminate ~ .vue-gridify-checkbox-checkmark:after {
  display: block;
  left: 2.5px;
  top: 5.5px;
  width: 7px;
  height: 1.5px;
  background: white;
}

.vue-gridify-table {
  position: relative;
}

.vue-gridify-table.resizing {
  cursor: col-resize;
}

.vue-gridify-table.resizing .vue-gridify-th,
.vue-gridify-table.resizing td {
  user-select: none;
}
</style>