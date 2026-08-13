<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'

interface Stock {
  id: string | null
  product_id: string
  product_name: string
  price: number | string
  quantity: number | string
}

const props = defineProps<{
  stock: Stock
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const quantity = ref<number | null>(null)
const loading = ref(false)
const error = ref('')

const API_URL = 'http://localhost:3000/api/stocks'

const isEdit = () => {
  return !!props.stock.id
}

watch(
  () => props.stock,
  (stock) => {
    error.value = ''

    if (stock) {
      quantity.value = Number(stock.quantity ?? 0)
    } else {
      quantity.value = 0
    }
  },
  {
    immediate: true,
  },
)

const submit = async () => {
  error.value = ''

  if (
    quantity.value === null ||
    !Number.isInteger(quantity.value) ||
    quantity.value < 0
  ) {
    error.value = 'Jumlah stock harus berupa angka bulat dan tidak boleh kurang dari 0.'
    return
  }

  try {
    loading.value = true

    if (isEdit()) {
      await axios.put(
        `${API_URL}/${props.stock.id}`,
        {
          quantity: quantity.value,
        },
      )
    } else {
      await axios.post(
        API_URL,
        {
          product_id: props.stock.product_id,
          quantity: quantity.value,
        },
      )
    }

    emit('success')
    emit('close')
  } catch (err: any) {
    console.error('Failed to save stock:', err)

    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = isEdit()
        ? 'Gagal memperbarui stock.'
        : 'Gagal menambahkan stock.'
    }
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  if (loading.value) {
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
      class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
    >

      <div
        class="flex items-center justify-between border-b border-gray-200 px-6 py-4"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEdit() ? 'Edit Stock' : 'Tambah Stock' }}
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            {{
              isEdit()
                ? 'Perbarui jumlah stock produk.'
                : 'Tambahkan stock untuk produk.'
            }}
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

      <form
        class="space-y-5 p-6"
        @submit.prevent="submit"
      >

        <div
          v-if="error"
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>

        <div>
          <label
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Product
          </label>

          <div
            class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3"
          >
            <p class="text-sm font-semibold text-gray-900">
              {{ stock.product_name }}
            </p>

            <p class="mt-1 text-xs text-gray-500">
              Product ID: {{ stock.product_id }}
            </p>
          </div>
        </div>

        <div>
          <label
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Price
          </label>

          <div
            class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3"
          >
            <span class="text-sm font-semibold text-gray-900">
              Rp {{ Number(stock.price || 0).toLocaleString('id-ID') }}
            </span>
          </div>

          <p class="mt-1 text-xs text-gray-400">
            Harga mengikuti data produk.
          </p>
        </div>

        <div>
          <label
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Stock Saat Ini
          </label>

          <div
            class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3"
          >
            <span class="text-sm font-semibold text-gray-900">
              {{ Number(stock.quantity || 0).toLocaleString('id-ID') }}
            </span>

            <span class="ml-1 text-xs text-gray-500">
              unit
            </span>
          </div>
        </div>

        <div>
          <label
            for="stock-quantity"
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {{ isEdit() ? 'Jumlah Stock' : 'Jumlah Stock Awal' }}

            <span class="text-red-500">
              *
            </span>
          </label>

          <input
            id="stock-quantity"
            v-model.number="quantity"
            type="number"
            min="0"
            step="1"
            placeholder="Masukkan jumlah stock"
            :disabled="loading"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-gray-100"
          />

          <p class="mt-1 text-xs text-gray-400">
            Masukkan jumlah dalam satuan unit.
          </p>
        </div>

        <div
          class="flex justify-end gap-3 border-t border-gray-100 pt-5"
        >
          <button
            type="button"
            :disabled="loading"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleClose"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="loading"
            class="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="loading">
              Saving...
            </span>

            <span v-else>
              {{ isEdit() ? 'Update Stock' : 'Add Stock' }}
            </span>
          </button>
        </div>

      </form>

    </div>
  </div>
</template>