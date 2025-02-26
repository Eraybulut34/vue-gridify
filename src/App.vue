<template>
  <div class="app">
    <header class="header">
      <h1>Vue Gridify</h1>
      <p class="subtitle">Powerful and flexible Vue 3 data grid component</p>
      <div class="badges">
        <img src="https://img.shields.io/npm/v/vue-gridify" alt="npm version" />
        <img src="https://img.shields.io/npm/l/vue-gridify" alt="license" />
        <img src="https://img.shields.io/npm/dt/vue-gridify" alt="downloads" />
      </div>
    </header>

    <main>
      <!-- Basic Usage -->
      <section class="demo-section">
        <h2>Basic Usage</h2>
        <p>Simple data grid with basic features</p>
        <VueGridify 
          :columns="basicColumns"
          :data="basicData"
          :page-size="5"
        />
      </section>

      <!-- Server-side Pagination -->
      <section class="demo-section">
        <h2>Server-side Pagination</h2>
        <p>Real-time data fetching with fake data generation</p>
        <VueGridify 
          :columns="userColumns"
          :data="users"
          :page-size="5"
          :server-side="true"
          :total-items="totalItems"
          :loading="loading"
          @page-changed="handlePageChange"
        />
      </section>

      <!-- Selection Feature -->
      <section class="demo-section">
        <h2>Row Selection</h2>
        <p>Select multiple rows and perform bulk actions</p>
        <div class="selection-info" v-if="selectedProducts.length">
          Selected: {{ selectedProducts.length }} items
          <button @click="clearSelection" class="action-button">Clear Selection</button>
        </div>
        <VueGridify 
          :columns="productColumns"
          :data="products"
          :page-size="5"
          :selectable="true"
          @selection-changed="handleProductSelection"
        />
      </section>

      <!-- Excel Export -->
      <section class="demo-section">
        <h2>Excel Export</h2>
        <p>Export your data to Excel with one click</p>
        <VueGridify 
          :columns="exportColumns"
          :data="exportData"
          :page-size="5"
          :enable-excel-export="true"
          export-button-text="Download Excel"
          file-name="demo-export"
        />
      </section>

      <!-- Resizable Columns -->
      <section class="demo-section">
        <h2>Resizable Columns</h2>
        <p>Customize column widths by dragging</p>
        <VueGridify 
          :columns="resizableColumns"
          :data="resizableData"
          :page-size="5"
        />
      </section>

            <!-- Custom Styling -->
      <section class="demo-section">
        <h2>Custom Styling</h2>
        <p>Apply custom CSS classes to cells. For example, the following styles are applied to the demo below:</p>
        <ul>
          <li><code>.custom-cell</code>: <code>border: 1px solid #6791c5;</code>, <code>font-weight: bold;</code></li>
        </ul>
        <VueGridify 
          :columns="stylingColumns"
          :data="stylingData"
          :page-size="5"
          rowClass="custom-row"
          cellClass="custom-cell"
        />
      </section>

      <!-- All Features Combined -->
      <section class="demo-section">
        <h2>All Features Combined</h2>
        <p>Experience all features working together seamlessly</p>
        <VueGridify 
          :columns="allFeaturesColumns"
          :data="allFeaturesData"
          :page-size="5"
          :selectable="true"
          :enable-excel-export="true"
          export-button-text="Export All"
          @selection-changed="handleAllFeaturesSelection"
        />
      </section>
    </main>

    <footer class="footer">
      <p>Made with ❤️ by Vue Gridify Team</p>
      <p>MIT License 2024</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueGridify from './components/VueGridify.vue'
import type { GridColumn, GridData } from './types'

// Basic Usage Data
const basicColumns: GridColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
  { field: 'email', header: 'Email' }
]

const basicData = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com' },
  { id: 6, name: 'Eva Green', email: 'eva@example.com' },
  { id: 7, name: 'Frank Miller', email: 'frank@example.com' },
  { id: 8, name: 'Grace Lee', email: 'grace@example.com' },
  { id: 9, name: 'Henry Ford', email: 'henry@example.com' },
  { id: 10, name: 'Ivy Chen', email: 'ivy@example.com' },
  { id: 11, name: 'Jack Black', email: 'jack@example.com' },
  { id: 12, name: 'Karen White', email: 'karen@example.com' }
]

// Server-side Pagination
const userColumns: GridColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
  { field: 'email', header: 'Email' },
  { field: 'role', header: 'Role' },
  { field: 'status', header: 'Status' }
]

const users = ref<GridData[]>([])
const loading = ref(false)
const totalItems = ref(0)
const currentUserPage = ref(1)
const currentUserPageSize = ref(5)

// Sahte veri üretme fonksiyonları
const roles = ['Admin', 'User', 'Editor', 'Viewer', 'Manager']
const statuses = ['Active', 'Inactive', 'Pending', 'Blocked']
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Emily', 'William', 'Olivia']
const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White']

const generateFakeUser = (id: number) => ({
  id,
  name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
  email: `user${id}@example.com`,
  role: roles[Math.floor(Math.random() * roles.length)],
  status: statuses[Math.floor(Math.random() * statuses.length)]
})

// Sahte API çağrısı simülasyonu
const fetchUsers = async (page: number, limit: number) => {
  loading.value = true
  currentUserPage.value = page
  currentUserPageSize.value = limit
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  try {
    // Toplam kayıt sayısı (gerçek API'den gelecek)
    totalItems.value = 100
    
    const start = (page - 1) * limit
    const fakeData = Array.from({ length: limit }, (_, index) => 
      generateFakeUser(start + index + 1)
    )
    
    users.value = fakeData
    console.log(`Fetched page ${page} with ${limit} items per page. Total: ${totalItems.value}`)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number, pageSize: number) => {
  console.log(`Page changed to ${page}, size: ${pageSize}`)
  if (page !== currentUserPage.value || pageSize !== currentUserPageSize.value) {
    fetchUsers(page, pageSize)
  }
}

// İlk yükleme için veriyi çek
onMounted(() => {
  fetchUsers(1, 5) // İlk sayfa ve sayfa başına 5 kayıt
})

// Products Selection
const productColumns: GridColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Product' },
  { field: 'price', header: 'Price' },
  { field: 'stock', header: 'Stock' }
]

const products = [
  { id: 1, name: 'Laptop', price: '$999', stock: 50 },
  { id: 2, name: 'Smartphone', price: '$699', stock: 100 },
  { id: 3, name: 'Headphones', price: '$199', stock: 200 },
  { id: 4, name: 'Tablet', price: '$499', stock: 75 },
  { id: 5, name: 'Smartwatch', price: '$299', stock: 150 }
]

const stylingColumns: GridColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Product' },
  { field: 'price', header: 'Price' },
  { field: 'stock', header: 'Stock' }
]

const stylingData = [
  { id: 1, name: 'Laptop', price: '$999', stock: 50 },
  { id: 2, name: 'Smartphone', price: '$699', stock: 100 },
  { id: 3, name: 'Headphones', price: '$199', stock: 200 },
  { id: 4, name: 'Tablet', price: '$499', stock: 75 },
  { id: 5, name: 'Smartwatch', price: '$299', stock: 150 }
]

const selectedProducts = ref<GridData[]>([])

const handleProductSelection = (selection: GridData[]) => {
  selectedProducts.value = selection
}

const clearSelection = () => {
  selectedProducts.value = []
}

// Excel Export
const exportColumns: GridColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'date', header: 'Date' },
  { field: 'revenue', header: 'Revenue' },
  { field: 'expenses', header: 'Expenses' },
  { field: 'profit', header: 'Profit' }
]

const exportData = [
  { id: 1, date: '2024-01', revenue: '$10,000', expenses: '$6,000', profit: '$4,000' },
  { id: 2, date: '2024-02', revenue: '$12,000', expenses: '$7,000', profit: '$5,000' },
  { id: 3, date: '2024-03', revenue: '$15,000', expenses: '$8,000', profit: '$7,000' },
  { id: 4, date: '2024-04', revenue: '$13,000', expenses: '$7,500', profit: '$5,500' },
  { id: 5, date: '2024-05', revenue: '$14,000', expenses: '$8,000', profit: '$6,000' }
]

// Resizable Columns
const resizableColumns: GridColumn[] = [
  { field: 'id', header: 'ID', resizable: true, width: 80 },
  { field: 'title', header: 'Title', resizable: true, width: 200 },
  { field: 'description', header: 'Description', resizable: true, width: 300 },
  { field: 'category', header: 'Category', resizable: true, width: 150 }
]

const resizableData = [
  { id: 1, title: 'Vue Basics', description: 'Learn Vue.js fundamentals and core concepts', category: 'Frontend' },
  { id: 2, title: 'Component Design', description: 'Best practices for Vue component architecture', category: 'Design' },
  { id: 3, title: 'State Management', description: 'Managing application state with Vuex', category: 'Architecture' },
  { id: 4, title: 'Testing Vue Apps', description: 'Unit testing and e2e testing for Vue applications', category: 'Testing' },
  { id: 5, title: 'Vue Performance', description: 'Optimizing Vue.js application performance', category: 'Performance' }
]

// All Features Combined
const allFeaturesColumns: GridColumn[] = [
  { field: 'id', header: 'ID', resizable: true, width: 80 },
  { field: 'project', header: 'Project', resizable: true, width: 200 },
  { field: 'status', header: 'Status', resizable: true, width: 150 },
  { field: 'progress', header: 'Progress', resizable: true, width: 120 },
  { field: 'deadline', header: 'Deadline', resizable: true, width: 150 }
]

const allFeaturesData = [
  { id: 1, project: 'Website Redesign', status: 'In Progress', progress: '75%', deadline: '2024-03-01' },
  { id: 2, project: 'Mobile App', status: 'Planning', progress: '25%', deadline: '2024-04-15' },
  { id: 3, project: 'API Integration', status: 'Completed', progress: '100%', deadline: '2024-02-28' },
  { id: 4, project: 'Database Migration', status: 'On Hold', progress: '50%', deadline: '2024-03-30' },
  { id: 5, project: 'Security Audit', status: 'Not Started', progress: '0%', deadline: '2024-05-01' }
]

const handleAllFeaturesSelection = (selection: GridData[]) => {
  console.log('Selected items:', selection)
}
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 4rem;
}

.header h1 {
  font-size: 3rem;
  margin: 0;
  background: linear-gradient(45deg, #42b883, #35495e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
  margin: 1rem 0;
}

.badges {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
}

.badges img {
  height: 20px;
}

.demo-section {
  margin-bottom: 4rem;
  padding: 2rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  color: #35495e;
  margin-top: 0;
}

.demo-section p {
  color: #666;
  margin-bottom: 2rem;
}

.selection-info {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: #f0f9ff;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-button {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.action-button:hover {
  background: #3aa876;
}

.footer {
  text-align: center;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  color: #666;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #fff;
  }

  .demo-section {
    background: #2a2a2a;
  }

  .demo-section h2 {
    color: #42b883;
  }

  .demo-section p {
    color: #bbb;
  }

  .selection-info {
    background: #2d3748;
    color: #fff;
  }

  .footer {
    border-top-color: #333;
    color: #bbb;
  }
}

.custom-row {
  background-color: #a4b7c4;
}

.custom-cell {
  border: 1px solid #6791c5;
  font-weight: bold;
}
</style>