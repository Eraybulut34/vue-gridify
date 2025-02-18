export interface GridColumn {
  field: string
  header: string
  resizable?: boolean
  sortable?: boolean
  filterable?: boolean
  width?: number | string
}

export interface GridData {
  id: string | number
  [key: string]: any
} 