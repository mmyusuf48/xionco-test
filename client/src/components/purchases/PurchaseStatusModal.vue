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
}

const props = defineProps<{
  purchase: Purchase
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: [status: string]
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

const handleStatus = (status: string) => {
  if (props.loading) {
    return
  }

  emit('confirm', status)
}

const handleClose = () => {
  if (props.loading) {
    return
  }

  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    @click.self="handleClose"
  >

    <div
      class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
    >

      <div
        class="flex items-center justify-between border-b border-gray-200 px-6 py-4"
      >

        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            Update Purchase Status
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            Pilih status untuk transaksi pembelian ini.
          </p>
        </div>

        <button
          type="button"
          :disabled="loading"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="handleClose"
        >
          ×
        </button>

      </div>

      <div class="p-6">
        <div
          class="rounded-lg border border-gray-200 bg-gray-50 p-4"
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
          v-if="purchase.status === 'PENDING'"
          class="mt-5 space-y-3"
        >

          <p class="text-sm font-medium text-gray-700">
            Pilih status:
          </p>

          <button
            type="button"
            :disabled="loading"
            class="w-full rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-left transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleStatus('COMPLETED')"
          >
            <div class="flex items-center justify-between">

              <div>
                <p class="text-sm font-semibold text-green-700">
                  Complete Purchase
                </p>

                <p class="mt-1 text-xs text-green-600">
                  Purchase selesai dan stock akan bertambah.
                </p>
              </div>

              <span class="text-green-600">
                →
              </span>

            </div>
          </button>

          <button
            type="button"
            :disabled="loading"
            class="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleStatus('CANCELLED')"
          >
            <div class="flex items-center justify-between">

              <div>
                <p class="text-sm font-semibold text-red-700">
                  Cancel Purchase
                </p>

                <p class="mt-1 text-xs text-red-600">
                  Purchase dibatalkan dan stock tidak berubah.
                </p>
              </div>

              <span class="text-red-600">
                ×
              </span>

            </div>
          </button>

        </div>

        <div
          v-else-if="purchase.status === 'COMPLETED'"
          class="mt-5"
        >

          <div
            class="rounded-lg border border-red-200 bg-red-50 p-4"
          >

            <p class="text-sm font-semibold text-red-700">
              Cancel Purchase
            </p>

            <p class="mt-1 text-xs leading-relaxed text-red-600">
              Purchase sudah selesai. Jika dibatalkan, stock akan
              dikurangi kembali sebanyak quantity purchase.
            </p>

          </div>

          <button
            type="button"
            :disabled="loading"
            class="mt-3 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            @click="handleStatus('CANCELLED')"
          >
            <span v-if="loading">
              Updating...
            </span>

            <span v-else>
              Cancel Purchase
            </span>
          </button>

        </div>

        <div
          v-else
          class="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4"
        >

          <p class="text-sm font-medium text-gray-700">
            Purchase sudah dibatalkan.
          </p>

          <p class="mt-1 text-xs text-gray-500">
            Status purchase yang sudah dibatalkan tidak dapat diubah
            kembali.
          </p>

        </div>

        <div
          class="mt-6 flex justify-end"
        >

          <button
            type="button"
            :disabled="loading"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleClose"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  </div>
</template>