# Vue Gridify

A powerful and flexible Vue 3 data grid component with built-in features for sorting, pagination, selection, and Excel export capabilities.

## Features

- Responsive data grid
- Mobile-friendly
- Client & Server-side pagination
- Row selection
- Excel export
- Resizable columns
- Customizable styling

## Installation

```bash
npm install vue-gridify
```

## Usage

```vue
<template>
  <VueGridify 
    :columns="columns"
    :data="data"
    :page-size="10"
    :selectable="true"
    :enable-excel-export="true"
    @selection-changed="handleSelectionChanged"
  />
</template>

<script setup lang="ts">
import { VueGridify } from 'vue-gridify'
import type { GridColumn, GridData } from 'vue-gridify'

const columns: GridColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
  { field: 'email', header: 'Email' }
]

const data: GridData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

const handleSelectionChanged = (selection: GridData[]) => {
  console.log('Selected rows:', selection)
}
</script>

### Excel Export Feature
Enable the export feature in your component:

```vue
<template>
  <VueGridify
    :columns="columns"
    :data="data"
    :enable-excel-export="true"
    export-button-text="Export to Excel"
    file-name="my-data"
  />
</template>
```

#### Excel Export Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| enableExcelExport | boolean | false | Enable/disable Excel export feature |
| exportButtonText | string | "Excel'e Aktar" | Text to display on the export button |
| fileName | string | 'grid-data' | Name of the exported Excel file (without extension) |

### Row Selection Features
The grid supports row selection with checkboxes. You can select individual rows or use the "Select All" checkbox to select all rows on the current page.

#### Selection Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| selectable | boolean | false | Enable/disable row selection feature |
| selectedRows | GridData[] | [] | Array of currently selected rows |

#### Selection Events
| Event | Parameters | Description |
|-------|------------|-------------|
| selectionChanged | (rows: GridData[]) | Emitted when row selection changes. Returns array of selected rows |

Example usage with row selection:
```vue
<template>
  <VueGridify
    :columns="columns"
    :data="data"
    :selectable="true"
    :selected-rows="selectedRows"
    @selection-changed="handleSelectionChanged"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedRows = ref([])

const handleSelectionChanged = (rows) => {
  selectedRows.value = rows
  console.log('Selected rows:', rows)
}
</script>

### Server-side Pagination Example

```vue
<template>
  <VueGridify 
    :columns="columns"
    :data="users"
    :page-size="10"
    :server-side="true"
    :total-items="totalItems"
    :loading="loading"
    @page-changed="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VueGridify } from 'vue-gridify'
import type { GridColumn, GridData } from 'vue-gridify'

const users = ref<GridData[]>([])
const loading = ref(false)
const totalItems = ref(0)

const fetchUsers = async (page: number, limit: number) => {
  loading.value = true
  try {
    const response = await fetch(`/api/users?page=${page}&limit=${limit}`)
    const data = await response.json()
    users.value = data.items
    totalItems.value = data.total
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number, pageSize: number) => {
  fetchUsers(page, pageSize)
}

onMounted(() => {
  fetchUsers(1, 10)
})
</script>

### Pagination Features
The grid comes with built-in client-side pagination with the following features:

- Configurable page size
- Page size selector
- First/Previous/Next/Last navigation
- Page number buttons
- Entry information display

#### Pagination Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| pageSize | number | 10 | Number of items to display per page |
| pageSizeOptions | number[] | [5, 10, 25, 50, 100] | Available options for page size selector |

Example usage with pagination:
```vue
<template>
  <VueGridify
    :columns="columns"
    :data="data"
    :page-size="25"
    :page-size-options="[10, 25, 50]"
  />
</template>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | GridColumn[] | required | Column definitions |
| data | GridData[] | required | Data to display |
| pageSize | number | 10 | Items per page |
| pageSizeOptions | number[] | [5,10,25,50] | Available page size options |
| enableExcelExport | boolean | true | Enable/disable Excel export |
| exportButtonText | string | "Export to Excel" | Text for export button |
| fileName | string | "grid-data" | Excel file name |
| selectable | boolean | false | Enable row selection |
| serverSide | boolean | false | Enable server-side pagination |
| totalItems | number | 0 | Total number of items (for server-side pagination) |
| loading | boolean | false | Loading state indicator |

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| selection-changed | (selection: GridData[]) | Emitted when row selection changes |
| page-changed | (page: number, pageSize: number) | Emitted when page or page size changes |

## Types

```typescript
interface GridColumn {
  field: string
  header: string
  resizable?: boolean
}

interface GridData {
  [key: string]: any
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License 2024
