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
