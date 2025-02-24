import { ref, computed } from 'vue'

export interface PaginationOptions {
  pageSize?: number
  initialPage?: number
  totalItems?: number
}

export function usePagination<T>(items: T[], options: PaginationOptions = {}) {
  const {
    pageSize = 10,
    initialPage = 1,
    totalItems = items.length
  } = options

  const currentPage = ref(initialPage)
  const itemsPerPage = ref(pageSize)

  // Toplam sayfa sayısı
  const totalPages = computed(() => Math.ceil(totalItems / itemsPerPage.value))

  // Mevcut sayfadaki öğeler
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return items.slice(start, end)
  })

  // Sayfa numaralarını hesapla (1,2,3,4,5 gibi)
  const pageNumbers = computed(() => {
    const pages = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)
    
    let startPage = Math.max(currentPage.value - halfVisible, 1)
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages.value)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  })

  // Sayfa değiştirme fonksiyonları
  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const firstPage = () => {
    currentPage.value = 1
  }

  const lastPage = () => {
    currentPage.value = totalPages.value
  }

  // Sayfa boyutunu değiştir
  const setPageSize = (size: number) => {
    itemsPerPage.value = size
    // Eğer mevcut sayfa artık geçersizse, son sayfaya git
    if (currentPage.value > totalPages.value) {
      lastPage()
    }
  }

  // Pagination durumu
  const paginationState = computed(() => ({
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    pageSize: itemsPerPage.value,
    totalItems,
    startIndex: (currentPage.value - 1) * itemsPerPage.value + 1,
    endIndex: Math.min(currentPage.value * itemsPerPage.value, totalItems),
    hasPrevPage: currentPage.value > 1,
    hasNextPage: currentPage.value < totalPages.value,
    isFirstPage: currentPage.value === 1,
    isLastPage: currentPage.value === totalPages.value
  }))

  return {
    // Temel state
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    pageNumbers,
    paginationState,

    // Metodlar
    setPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setPageSize
  }
}
