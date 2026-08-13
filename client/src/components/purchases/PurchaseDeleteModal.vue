<script setup lang="ts">
interface Purchase {
  id: string
  product_id: string
  product_name: string
  quantity: number | string
  price: number | string
  total: number | string
  status: string
  created_at?: string
  updated_at?: string
}

const props = defineProps<{
  purchase: Purchase
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const formatPrice = (
  value: number | string | null | undefined,
) => {
  return new Intl.NumberFormat('id-ID').format(
    Number(value || 0),
  )
}

const formatQuantity = (
  value: number | string | null | undefined,
) => {
  return new Intl.NumberFormat('id-ID').format(
    Number(value || 0),
  )
}

const handleConfirm = () => {
  if (props.loading) {
    return
  }

  emit('confirm')
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
    >

      <div
        class="flex items-center justify-between border-b border-gray-200 px-6 py-4"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            Cancel Purchase
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            Apakah kamu yakin ingin membatalkan pembelian ini?
          </p>
        </div>

        <button
          type="button"
          :disabled="loading"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="emit('close')"
        >
          ×
        </button>
      </div>

      <div class="p-6">
        <div
          class="rounded-lg border border-yellow-200 bg-yellow-50 p-4"
        >
          <p class="text-sm font-medium text-yellow-800">
            Pembelian akan dibatalkan.
          </p>

          <p class="mt-1 text-xs leading-relaxed text-yellow-700">
            Transaksi tidak akan dihapus dari riwayat. Stock akan
            dikurangi kembali sesuai jumlah pembelian.
          </p>
        </div>

        <div
          class="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <div
            class="flex items-start justify-between gap-4"
          >
            <span class="text-sm text-gray-500">
              Product
            </span>

            <span
              class="text-right text-sm font-medium text-gray-900"
            >
              {{ purchase.product_name || '-' }}
            </span>
          </div>

          <div
            class="mt-3 flex items-center justify-between gap-4"
          >
            <span class="text-sm text-gray-500">
              Quantity
            </span>

            <span class="text-sm font-medium text-gray-900">
              {{ formatQuantity(purchase.quantity) }}
              unit
            </span>
          </div>

          <div
            class="mt-3 flex items-center justify-between gap-4"
          >
            <span class="text-sm text-gray-500">
              Price
            </span>

            <span class="text-sm font-medium text-gray-900">
              Rp {{ formatPrice(purchase.price) }}
            </span>
          </div>

          <div
            class="mt-3 flex items-center justify-between gap-4 border-t border-gray-200 pt-3"
          >
            <span class="text-sm font-medium text-gray-700">
              Total
            </span>

            <span class="text-base font-semibold text-gray-900">
              Rp {{ formatPrice(purchase.total) }}
            </span>
          </div>

        </div>

        <div
          class="mt-6 flex justify-end gap-3"
        >
          <button
            type="button"
            :disabled="loading"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            @click="emit('close')"
          >
            Kembali
          </button>

          <button
            type="button"
            :disabled="loading"
            class="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            @click="handleConfirm"
          >
            <span v-if="loading">
              Membatalkan...
            </span>

            <span v-else>
              Cancel Purchase
            </span>
          </button>

        </div>

      </div>
    </div>
  </div>
</template>