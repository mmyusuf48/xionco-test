<script setup lang="ts">
import { ref } from 'vue'
import StockForm from './StockForm.vue'

interface Stock {
  id: string | null
  product_id: string
  product_name: string
  price: number | string
  quantity: number | string
  created_at?: string
  updated_at?: string
}

const props = defineProps<{
  stocks: Stock[]
}>()

const emit = defineEmits<{
  success: []
}>()

const showStockForm = ref(false)
const selectedStock = ref<Stock | null>(null)

const stockStatus = (quantity: number) => {
  if (quantity === 0) {
    return {
      label: 'Out of Stock',
      class: 'bg-red-50 text-red-700',
    }
  }

  if (quantity <= 10) {
    return {
      label: 'Low Stock',
      class: 'bg-yellow-50 text-yellow-700',
    }
  }

  return {
    label: 'Available',
    class: 'bg-green-50 text-green-700',
  }
}

const formatPrice = (price: number | string) => {
  return Number(price || 0).toLocaleString('id-ID')
}

const formatQuantity = (quantity: number | string) => {
  return Number(quantity || 0).toLocaleString('id-ID')
}

const handleStockAction = (stock: Stock) => {
  selectedStock.value = stock
  showStockForm.value = true
}

const closeStockForm = () => {
  if (showStockForm.value) {
    showStockForm.value = false
  }

  selectedStock.value = null
}

const handleStockSuccess = () => {
  closeStockForm()
  emit('success')
}
</script>

<template>
  <div>

    <!-- Empty State -->
    <div
      v-if="props.stocks.length === 0"
      class="flex min-h-48 items-center justify-center"
    >
      <div class="text-center">

        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400"
        >
          —
        </div>

        <p class="mt-3 text-sm font-medium text-gray-700">
          Belum ada produk
        </p>

        <p class="mt-1 text-sm text-gray-500">
          Tambahkan produk terlebih dahulu untuk mengelola stock.
        </p>

      </div>
    </div>

    <!-- Table -->
    <div
      v-else
      class="overflow-x-auto"
    >

      <table class="w-full min-w-[850px]">

        <thead>
          <tr class="border-b border-gray-200">

            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Product
            </th>

            <th
              class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Price
            </th>

            <th
              class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Stock
            </th>

            <th
              class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Status
            </th>

            <th
              class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Action
            </th>

          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">

          <tr
            v-for="stock in props.stocks"
            :key="stock.product_id"
            class="transition hover:bg-gray-50"
          >

            <!-- Product -->
            <td class="px-4 py-4">
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ stock.product_name }}
                </p>

                <p class="mt-1 text-xs text-gray-400">
                  ID: {{ stock.product_id }}
                </p>
              </div>
            </td>

            <!-- Price -->
            <td class="px-4 py-4 text-right">
              <span class="text-sm font-medium text-gray-700">
                Rp {{ formatPrice(stock.price) }}
              </span>
            </td>

            <!-- Stock -->
            <td class="px-4 py-4 text-right">
              <span class="text-sm font-semibold text-gray-900">
                {{ formatQuantity(stock.quantity) }}
              </span>

              <span class="ml-1 text-xs text-gray-400">
                unit
              </span>
            </td>

            <!-- Status -->
            <td class="px-4 py-4 text-center">
              <span
                class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                :class="
                  stockStatus(
                    Number(stock.quantity)
                  ).class
                "
              >
                {{
                  stockStatus(
                    Number(stock.quantity)
                  ).label
                }}
              </span>
            </td>

            <!-- Action -->
            <td class="px-4 py-4 text-center">

              <button
                v-if="stock.id"
                type="button"
                class="rounded-lg bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100"
                @click="handleStockAction(stock)"
              >
                Edit Stock
              </button>

              <button
                v-else
                type="button"
                class="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
                @click="handleStockAction(stock)"
              >
                Add Stock
              </button>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

    <!-- Stock Form -->
    <StockForm
      v-if="showStockForm && selectedStock"
      :stock="selectedStock"
      @close="closeStockForm"
      @success="handleStockSuccess"
    />

  </div>
</template>