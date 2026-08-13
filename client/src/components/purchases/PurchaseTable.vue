<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import PurchaseStatusModal from './PurchaseStatusModal.vue'

interface Purchase {
  id: string
  product_id: string
  product_name: string
  product_price?: number | string
  quantity: number | string
  price: number | string
  total: number | string
  status: string
  created_at?: string
  updated_at?: string
}

const purchases = ref<Purchase[]>([])

const loading = ref(false)
const error = ref('')

const showStatusModal = ref(false)
const selectedPurchase = ref<Purchase | null>(null)
const updatingStatus = ref(false)

const emit = defineEmits<{
  summary: [
    data: {
      total: number
      pending: number
      totalValue: number
    },
  ]
}>()

const API_URL = 'http://localhost:3000/api/purchases'

const fetchPurchases = async () => {
  try {
    loading.value = true
    error.value = ''

    const res = await axios.get(API_URL)

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.data ?? []

    purchases.value = data.map((purchase: any) => ({
      ...purchase,
      quantity: Number(purchase.quantity),
      price: Number(purchase.price),
      total: Number(purchase.total),
      status: purchase.status,
    }))

    updateSummary()
  } catch (err) {
    console.error('Failed to fetch purchases:', err)

    error.value = 'Gagal mengambil data pembelian.'
  } finally {
    loading.value = false
  }
}

const updateSummary = () => {
  const total = purchases.value.length

  const pending = purchases.value.filter(
    purchase => purchase.status === 'PENDING',
  ).length

  const totalValue = purchases.value
    .filter(purchase => purchase.status === 'COMPLETED')
    .reduce(
      (total, purchase) =>
        total + Number(purchase.total || 0),
      0,
    )

  emit('summary', {
    total,
    pending,
    totalValue,
  })
}

const formatPrice = (value: number | string) => {
  return new Intl.NumberFormat('id-ID').format(
    Number(value || 0),
  )
}

const formatQuantity = (value: number | string) => {
  return new Intl.NumberFormat('id-ID').format(
    Number(value || 0),
  )
}

const formatDate = (value?: string) => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const statusLabel = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'Completed'

    case 'PENDING':
      return 'Pending'

    case 'CANCELLED':
      return 'Cancelled'

    default:
      return status
  }
}

const statusClass = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-50 text-green-700'

    case 'PENDING':
      return 'bg-yellow-50 text-yellow-700'

    case 'CANCELLED':
      return 'bg-red-50 text-red-700'

    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const openStatusModal = (purchase: Purchase) => {
  if (purchase.status === 'CANCELLED') {
    return
  }

  selectedPurchase.value = purchase
  showStatusModal.value = true
}

const closeStatusModal = () => {
  if (updatingStatus.value) {
    return
  }

  showStatusModal.value = false
  selectedPurchase.value = null
}

const updateStatus = async (status: string) => {
  if (!selectedPurchase.value) {
    return
  }

  try {
    updatingStatus.value = true
    error.value = ''

    await axios.patch(
      `${API_URL}/${selectedPurchase.value.id}/status`,
      {
        status,
      },
    )

    await fetchPurchases()

    showStatusModal.value = false
    selectedPurchase.value = null
  } catch (err: any) {
    console.error('Failed to update purchase status:', err)

    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Gagal mengubah status pembelian.'
    }
  } finally {
    updatingStatus.value = false
  }
}

onMounted(() => {
  fetchPurchases()
})

defineExpose({
  fetchPurchases,
})
</script>

<template>
  <div>

    <div
      v-if="error"
      class="mb-5 rounded-lg border border-red-200 bg-red-50 p-4"
    >
      <p class="text-sm font-medium text-red-700">
        {{ error }}
      </p>

      <button
        type="button"
        class="mt-2 text-sm font-medium text-red-700 underline"
        @click="fetchPurchases"
      >
        Coba lagi
      </button>
    </div>

    <div
      v-if="loading"
      class="flex min-h-64 items-center justify-center"
    >
      <div class="text-center">

        <div
          class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-cyan-500"
        />

        <p class="mt-3 text-sm text-gray-500">
          Memuat data pembelian...
        </p>

      </div>
    </div>

    <div
      v-else-if="purchases.length === 0"
      class="flex min-h-64 items-center justify-center"
    >
      <div class="text-center">

        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-400"
        >
          —
        </div>

        <p class="mt-3 text-sm font-medium text-gray-700">
          Belum ada pembelian
        </p>

        <p class="mt-1 text-sm text-gray-500">
          Data transaksi pembelian akan muncul di sini.
        </p>

      </div>
    </div>

    <div
      v-else
      class="overflow-x-auto"
    >

      <table class="w-full min-w-[950px]">

        <thead>
          <tr class="border-b border-gray-200">

            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
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
              Price
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
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Date
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
            v-for="purchase in purchases"
            :key="purchase.id"
            class="transition hover:bg-gray-50"
          >

            <td class="px-4 py-4">
              <div>

                <p class="text-sm font-medium text-gray-900">
                  {{ purchase.product_name || '-' }}
                </p>

                <p class="mt-1 text-xs text-gray-400">
                  ID: {{ purchase.product_id }}
                </p>

              </div>
            </td>

            <td class="px-4 py-4 text-center">
              <span class="text-sm font-medium text-gray-900">
                {{ formatQuantity(purchase.quantity) }}
              </span>

              <span class="ml-1 text-xs text-gray-400">
                unit
              </span>
            </td>

            <td class="px-4 py-4 text-right">
              <span class="text-sm text-gray-700">
                Rp {{ formatPrice(purchase.price) }}
              </span>
            </td>

            <td class="px-4 py-4 text-right">
              <span class="text-sm font-semibold text-gray-900">
                Rp {{ formatPrice(purchase.total) }}
              </span>
            </td>

            <td class="px-4 py-4 text-center">
              <span
                class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                :class="statusClass(purchase.status)"
              >
                {{ statusLabel(purchase.status) }}
              </span>
            </td>

            <td class="px-4 py-4">
              <span class="text-sm text-gray-600">
                {{ formatDate(purchase.created_at) }}
              </span>
            </td>

            <td class="px-4 py-4 text-center">

              <button
                v-if="purchase.status === 'PENDING'"
                type="button"
                class="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-700 transition hover:bg-cyan-100"
                @click="openStatusModal(purchase)"
              >
                Update Status
              </button>

              <button
                v-else-if="purchase.status === 'COMPLETED'"
                type="button"
                class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                @click="openStatusModal(purchase)"
              >
                Cancel
              </button>

              <span
                v-else
                class="text-xs text-gray-400"
              >
                —
              </span>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

    <PurchaseStatusModal
      v-if="showStatusModal && selectedPurchase"
      :purchase="selectedPurchase"
      :loading="updatingStatus"
      @close="closeStatusModal"
      @confirm="updateStatus"
    />

  </div>
</template>