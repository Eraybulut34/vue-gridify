# Vue Gridify

A powerful and flexible Vue 3 data grid component with built-in features for sorting, pagination, selection, Excel export capabilities, and customizable styling.

## Features

- Responsive data grid
- Mobile-friendly
- Client & Server-side pagination
- Row selection
- Excel export
- Resizable columns
- Customizable styling
- Custom row and cell classes

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

## Features

### Resizable Columns

Enable resizable columns by setting the `resizable` property to `true` in your column definitions. You can also specify an initial width for each column.

```vue
<template>
  <VueGridify 
    :columns="resizableColumns"
    :data="data"
  />
</template>

<script setup>
const resizableColumns = [
  { field: 'id', header: 'ID', resizable: true, width: 80 },
  { field: 'name', header: 'Name', resizable: true, width: 200 },
  { field: 'description', header: 'Description', resizable: true, width: 300 }
]
</script>

#### Resizable Column Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| resizable | boolean | false | Enable column resizing |
| width | number \| string | undefined | Initial width of the column (number for pixels, string for CSS values) |

### Custom Styling

You can apply custom CSS classes to rows and cells for advanced styling.

```vue
<template>
  <VueGridify 
    :columns="columns"
    :data="data"
    rowClass="custom-row"
    cellClass="custom-cell"
  />
</template>

<style>
.custom-row {
  background-color: #f9f9f9;
}
.custom-row:hover {
  background-color: #eaeaea;
}
.custom-cell {
  font-weight: bold;
  border: 1px solid #6791c5;
}
</style>

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
| exportButtonText | string | "Export to Excel" | Text to display on the export button |
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
| selection-changed | (rows: GridData[]) | Emitted when row selection changes. Returns array of selected rows |

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
| pageSizeOptions | number[] | [5, 10, 20, 50, 100] | Available options for page size selector |

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
| pageSizeOptions | number[] | [5, 10, 20, 50, 100] | Available page size options |
| enableExcelExport | boolean | false | Enable/disable Excel export |
| exportButtonText | string | "Export to Excel" | Text for export button |
| fileName | string | "grid-data" | Excel file name |
| selectable | boolean | false | Enable row selection |
| selectedRows | GridData[] | [] | Pre-selected rows |
| serverSide | boolean | false | Enable server-side pagination |
| totalItems | number | 0 | Total number of items (for server-side pagination) |
| loading | boolean | false | Loading state indicator |
| rowClass | string | '' | Custom CSS class for table rows |
| cellClass | string | '' | Custom CSS class for table cells |

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
  sortable?: boolean
  filterable?: boolean
  width?: number | string
}

interface GridData {
  id: string | number
  [key: string]: any
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License 2024
