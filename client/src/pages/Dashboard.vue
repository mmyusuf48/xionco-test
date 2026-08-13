<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

interface StockSummary {
  total_products: number
  total_stock: number
  low_stock: number
  out_of_stock: number
}

interface Purchase {
  id: string
  product_id: string
  product_name: string
  quantity: number | string
  price: number | string
  total: number | string
  status: string
  created_at?: string
}

const loading = ref(false)
const error = ref('')

const stockSummary = ref<StockSummary>({
  total_products: 0,
  total_stock: 0,
  low_stock: 0,
  out_of_stock: 0,
})

const purchases = ref<Purchase[]>([])

const STOCK_API_URL =
  'http://localhost:3000/api/stocks'

const PURCHASE_API_URL =
  'http://localhost:3000/api/purchases'

const fetchDashboard = async () => {
  try {
    loading.value = true
    error.value = ''

    const [
      stockResponse,
      purchaseResponse,
    ] = await Promise.all([
      axios.get(
        `${STOCK_API_URL}/summary`,
      ),
      axios.get(
        PURCHASE_API_URL,
      ),
    ])

    stockSummary.value = {
      total_products: Number(
        stockResponse.data.total_products || 0,
      ),
      total_stock: Number(
        stockResponse.data.total_stock || 0,
      ),
      low_stock: Number(
        stockResponse.data.low_stock || 0,
      ),
      out_of_stock: Number(
        stockResponse.data.out_of_stock || 0,
      ),
    }

    const purchaseData =
      Array.isArray(purchaseResponse.data)
        ? purchaseResponse.data
        : purchaseResponse.data.data ?? []

    purchases.value = purchaseData.map(
      (purchase: any) => ({
        ...purchase,
        quantity: Number(
          purchase.quantity || 0,
        ),
        price: Number(
          purchase.price || 0,
        ),
        total: Number(
          purchase.total || 0,
        ),
      }),
    )
  } catch (err) {
    console.error(
      'Failed to fetch dashboard:',
      err,
    )

    error.value =
      'Gagal mengambil data dashboard.'
  } finally {
    loading.value = false
  }
}

const totalPurchase = computed(() => {
  return purchases.value.filter(
    purchase =>
      purchase.status === 'COMPLETED',
  ).length
})

const totalPurchaseValue = computed(() => {
  return purchases.value
    .filter(
      purchase =>
        purchase.status === 'COMPLETED',
    )
    .reduce(
      (total, purchase) =>
        total +
        Number(purchase.total || 0),
      0,
    )
})

const recentPurchases = computed(() => {
  return purchases.value.slice(0, 5)
})

const formatNumber = (
  value: number | string,
) => {
  return Number(
    value || 0,
  ).toLocaleString('id-ID')
}

const formatPrice = (
  value: number | string,
) => {
  return Number(
    value || 0,
  ).toLocaleString('id-ID')
}

const formatDate = (
  value?: string,
) => {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(new Date(value))
}

const statusLabel = (
  status: string,
) => {
  switch (status) {
    case 'PENDING':
      return 'Pending'

    case 'COMPLETED':
      return 'Completed'

    case 'CANCELLED':
      return 'Cancelled'

    default:
      return status
  }
}

const statusClass = (
  status: string,
) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-50 text-yellow-700'

    case 'COMPLETED':
      return 'bg-green-50 text-green-700'

    case 'CANCELLED':
      return 'bg-red-50 text-red-700'

    default:
      return 'bg-gray-100 text-gray-700'
  }
}

onMounted(() => {
  fetchDashboard()
})
</script>

<template>
  <div>

    <!-- Page Header -->
    <div
      class="mb-6 flex items-start justify-between"
    >
      <div>
        <h1
          class="text-2xl font-semibold text-gray-900"
        >
          Dashboard
        </h1>

        <p
          class="mt-1 text-sm text-gray-500"
        >
          Ringkasan sistem pembelian.
        </p>
      </div>

      <button
        type="button"
        :disabled="loading"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        @click="fetchDashboard"
      >
        Refresh
      </button>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4"
    >
      <p
        class="text-sm font-medium text-red-700"
      >
        {{ error }}
      </p>

      <button
        type="button"
        class="mt-2 text-sm font-medium text-red-700 underline"
        @click="fetchDashboard"
      >
        Coba lagi
      </button>
    </div>

    <!-- Statistics -->
    <div
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
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
          class="mt-2 text-3xl font-semibold text-gray-900"
        >
          {{
            formatNumber(
              stockSummary.total_products,
            )
          }}
        </p>

        <p
          v-else
          class="mt-2 text-3xl font-semibold text-gray-300"
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
          class="mt-2 text-3xl font-semibold text-gray-900"
        >
          {{
            formatNumber(
              stockSummary.total_stock,
            )
          }}
        </p>

        <p
          v-else
          class="mt-2 text-3xl font-semibold text-gray-300"
        >
          —
        </p>
      </div>

      <!-- Total Purchase -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-gray-500">
          Total Pembelian
        </p>

        <p
          v-if="!loading"
          class="mt-2 text-3xl font-semibold text-gray-900"
        >
          {{ formatNumber(totalPurchase) }}
        </p>

        <p
          v-else
          class="mt-2 text-3xl font-semibold text-gray-300"
        >
          —
        </p>
      </div>

      <!-- Total Purchase Value -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-gray-500">
          Total Nilai Pembelian
        </p>

        <p
          v-if="!loading"
          class="mt-2 text-2xl font-semibold text-gray-900"
        >
          Rp
          {{
            formatPrice(
              totalPurchaseValue,
            )
          }}
        </p>

        <p
          v-else
          class="mt-2 text-2xl font-semibold text-gray-300"
        >
          —
        </p>
      </div>

    </div>

    <!-- Stock Warning -->
    <div
      class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2"
    >

      <!-- Low Stock -->
      <div
        class="rounded-xl border border-yellow-200 bg-yellow-50 p-5"
      >
        <p
          class="text-sm font-medium text-yellow-700"
        >
          Stock Menipis
        </p>

        <p
          v-if="!loading"
          class="mt-2 text-2xl font-semibold text-yellow-800"
        >
          {{
            formatNumber(
              stockSummary.low_stock,
            )
          }}
        </p>

        <p
          v-else
          class="mt-2 text-2xl font-semibold text-yellow-300"
        >
          —
        </p>

        <p
          class="mt-1 text-xs text-yellow-700"
        >
          Produk dengan stock 1 sampai 10 unit.
        </p>
      </div>

      <!-- Out Of Stock -->
      <div
        class="rounded-xl border border-red-200 bg-red-50 p-5"
      >
        <p
          class="text-sm font-medium text-red-700"
        >
          Produk Habis
        </p>

        <p
          v-if="!loading"
          class="mt-2 text-2xl font-semibold text-red-800"
        >
          {{
            formatNumber(
              stockSummary.out_of_stock,
            )
          }}
        </p>

        <p
          v-else
          class="mt-2 text-2xl font-semibold text-red-300"
        >
          —
        </p>

        <p
          class="mt-1 text-xs text-red-700"
        >
          Produk yang saat ini tidak memiliki stock.
        </p>
      </div>

    </div>

    <!-- Recent Purchases -->
    <div
      class="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm"
    >

      <!-- Header -->
      <div
        class="border-b border-gray-200 px-6 py-4"
      >
        <h2
          class="text-base font-semibold text-gray-900"
        >
          Pembelian Terbaru
        </h2>

        <p
          class="mt-1 text-sm text-gray-500"
        >
          Lima transaksi pembelian terakhir.
        </p>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="flex min-h-48 items-center justify-center"
      >
        <div class="text-center">

          <div
            class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-cyan-500"
          />

          <p
            class="mt-3 text-sm text-gray-500"
          >
            Memuat pembelian...
          </p>

        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="
          recentPurchases.length === 0
        "
        class="flex min-h-48 items-center justify-center px-6"
      >
        <div class="text-center">

          <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-400"
          >
            —
          </div>

          <p
            class="mt-3 text-sm font-medium text-gray-700"
          >
            Belum ada pembelian
          </p>

          <p
            class="mt-1 text-sm text-gray-500"
          >
            Data transaksi pembelian akan muncul di sini.
          </p>

        </div>
      </div>

      <!-- Table -->
      <div
        v-else
        class="overflow-x-auto"
      >
        <table
          class="w-full min-w-[800px]"
        >

          <thead>
            <tr
              class="border-b border-gray-200"
            >

              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Product
              </th>

              <th
                class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Quantity
              </th>

              <th
                class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Total
              </th>

              <th
                class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Status
              </th>

              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Date
              </th>

            </tr>
          </thead>

          <tbody
            class="divide-y divide-gray-100"
          >

            <tr
              v-for="purchase in recentPurchases"
              :key="purchase.id"
              class="transition hover:bg-gray-50"
            >

              <!-- Product -->
              <td class="px-6 py-4">
                <p
                  class="text-sm font-medium text-gray-900"
                >
                  {{
                    purchase.product_name ||
                    '-'
                  }}
                </p>

                <p
                  class="mt-1 text-xs text-gray-400"
                >
                  ID: {{ purchase.product_id }}
                </p>
              </td>

              <!-- Quantity -->
              <td
                class="px-4 py-4 text-center"
              >
                <span
                  class="text-sm text-gray-700"
                >
                  {{
                    formatNumber(
                      purchase.quantity,
                    )
                  }}
                  unit
                </span>
              </td>

              <!-- Total -->
              <td
                class="px-4 py-4 text-right"
              >
                <span
                  class="text-sm font-semibold text-gray-900"
                >
                  Rp
                  {{
                    formatPrice(
                      purchase.total,
                    )
                  }}
                </span>
              </td>

              <!-- Status -->
              <td
                class="px-4 py-4 text-center"
              >
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="
                    statusClass(
                      purchase.status,
                    )
                  "
                >
                  {{
                    statusLabel(
                      purchase.status,
                    )
                  }}
                </span>
              </td>

              <!-- Date -->
              <td class="px-6 py-4">
                <span
                  class="text-sm text-gray-600"
                >
                  {{
                    formatDate(
                      purchase.created_at,
                    )
                  }}
                </span>
              </td>

            </tr>

          </tbody>

        </table>
      </div>

    </div>

  </div>
</template>