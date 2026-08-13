<script setup lang="ts">
import { ref } from 'vue'
import PurchaseTable from '../components/purchases/PurchaseTable.vue'
import PurchaseForm from '../components/purchases/PurchaseForm.vue'

const purchaseTable = ref<InstanceType<typeof PurchaseTable> | null>(null)

const showForm = ref(false)

const summary = ref({
  total: 0,
  pending: 0,
  totalValue: 0,
})

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

const handleSummary = (data: {
  total: number
  pending: number
  totalValue: number
}) => {
  summary.value = data
}

const handlePurchaseSuccess = async () => {
  await purchaseTable.value?.fetchPurchases()
}

const openCreatePurchase = () => {
  showForm.value = true
}

const closeCreatePurchase = () => {
  showForm.value = false
}
</script>

<template>
  <div>

    <!-- Page Header -->
    <div class="mb-6 flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">
          Purchases
        </h1>

        <p class="mt-1 text-sm text-gray-500">
          Kelola data pembelian produk.
        </p>
      </div>

      <button
        type="button"
        class="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600"
        @click="openCreatePurchase"
      >
        + New Purchase
      </button>
    </div>

    <!-- Summary -->
    <div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">

      <!-- Total Purchase -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-gray-500">
          Total Pembelian
        </p>

        <p class="mt-2 text-2xl font-semibold text-gray-900">
          {{ summary.total }}
        </p>
      </div>

      <!-- Pending -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-gray-500">
          Pending
        </p>

        <p class="mt-2 text-2xl font-semibold text-yellow-600">
          {{ summary.pending }}
        </p>
      </div>

      <!-- Total Value -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-gray-500">
          Total Nilai Pembelian
        </p>

        <p class="mt-2 text-xl font-semibold text-gray-900">
          Rp {{ formatPrice(summary.totalValue) }}
        </p>
      </div>

    </div>

    <!-- Purchase List -->
    <div
      class="rounded-xl border border-gray-200 bg-white shadow-sm"
    >

      <!-- Header -->
      <div
        class="border-b border-gray-200 px-6 py-4"
      >
        <h2 class="text-base font-semibold text-gray-900">
          Purchase List
        </h2>

        <p class="mt-1 text-sm text-gray-500">
          Daftar transaksi pembelian.
        </p>
      </div>

      <!-- Table -->
      <div class="p-6">
        <PurchaseTable
          ref="purchaseTable"
          @summary="handleSummary"
        />
      </div>

    </div>

    <!-- New Purchase -->
    <PurchaseForm
      v-if="showForm"
      @close="closeCreatePurchase"
      @success="handlePurchaseSuccess"
    />

  </div>
</template>