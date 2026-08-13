<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import StockTable from '../components/stocks/StockTable.vue'

interface Stock {
  id: string | null
  product_id: string
  product_name: string
  price: number | string
  quantity: number | string
  created_at?: string
  updated_at?: string
}

const stocks = ref<Stock[]>([])
const loading = ref(false)
const error = ref('')

const API_URL = 'http://localhost:3000/api/stocks'

const fetchStocks = async () => {
  try {
    loading.value = true
    error.value = ''

    const res = await axios.get(API_URL)

    stocks.value = Array.isArray(res.data)
      ? res.data
      : res.data.data ?? []
  } catch (err) {
    console.error('Failed to fetch stocks:', err)

    error.value = 'Gagal mengambil data stock.'
  } finally {
    loading.value = false
  }
}

const totalProduct = computed(() => {
  return stocks.value.length
})

const totalStock = computed(() => {
  return stocks.value.reduce(
    (total, stock) =>
      total + Number(stock.quantity || 0),
    0,
  )
})

const lowStock = computed(() => {
  return stocks.value.filter(
    stock =>
      Number(stock.quantity) > 0 &&
      Number(stock.quantity) <= 10,
  ).length
})

const outOfStock = computed(() => {
  return stocks.value.filter(
    stock =>
      Number(stock.quantity) === 0,
  ).length
})

onMounted(() => {
  fetchStocks()
})
</script>

<template>
  <div>

    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        Stock
      </h1>

      <p class="mt-1 text-sm text-gray-500">
        Pantau ketersediaan stock produk.
      </p>
    </div>

    <!-- Summary -->
    <div
      class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >

      <!-- Total Product -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-gray-500">
          Total Produk
        </p>

        <p
          v-if="!loading"
          class="mt-2 text-2xl font-semibold text-gray-900"
        >
          {{ totalProduct }}
        </p>

        <p
          v-else
          class="mt-2 text-2xl font-semibold text-gray-300"
        >
          —
        </p>
      </div>

      <!-- Total Stock -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-gray-500">
          Total Stock
        </p>

        <p
          v-if="!loading"
          class="mt-2 text-2xl font-semibold text-gray-900"
        >
          {{ totalStock.toLocaleString('id-ID') }}
        </p>

        <p
          v-else
          class="mt-2 text-2xl font-semibold text-gray-300"
        >
          —
        </p>
      </div>

      <!-- Low Stock -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-gray-500">
          Stock Menipis
        </p>

        <p
          v-if="!loading"
          class="mt-2 text-2xl font-semibold text-yellow-600"
        >
          {{ lowStock }}
        </p>

        <p
          v-else
          class="mt-2 text-2xl font-semibold text-gray-300"
        >
          —
        </p>
      </div>

      <!-- Out of Stock -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-gray-500">
          Habis
        </p>

        <p
          v-if="!loading"
          class="mt-2 text-2xl font-semibold text-red-600"
        >
          {{ outOfStock }}
        </p>

        <p
          v-else
          class="mt-2 text-2xl font-semibold text-gray-300"
        >
          —
        </p>
      </div>

    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4"
    >
      <p class="text-sm font-medium text-red-700">
        {{ error }}
      </p>

      <button
        type="button"
        class="mt-2 text-sm font-medium text-red-700 underline"
        @click="fetchStocks"
      >
        Coba lagi
      </button>
    </div>

    <!-- Stock Table -->
    <div
      class="rounded-xl border border-gray-200 bg-white shadow-sm"
    >

      <div
        class="border-b border-gray-200 px-6 py-4"
      >
        <h2 class="text-base font-semibold text-gray-900">
          Stock Produk
        </h2>

        <p class="mt-1 text-sm text-gray-500">
          Daftar stock seluruh produk.
        </p>
      </div>

      <div class="p-6">
        <StockTable
          :stocks="stocks"
          @success="fetchStocks"
        />
      </div>

    </div>

  </div>
</template>