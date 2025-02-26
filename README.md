# Vue Gridify

## 📦 Installation
```sh
npm install vue-gridify
```

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
