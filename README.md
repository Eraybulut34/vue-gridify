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
