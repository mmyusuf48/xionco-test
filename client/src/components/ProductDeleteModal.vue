<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface Product {
  id: string | number
  name: string
}

const props = defineProps<{
  product: Product | null
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const loading = ref(false)
const error = ref('')

const API_URL =
  'http://localhost:3000/api/products'

const handleDelete = async () => {
  if (!props.product) {
    return
  }

  try {
    loading.value = true
    error.value = ''

    await axios.delete(
      `${API_URL}/${props.product.id}`,
    )

    emit('success')
    emit('close')
  } catch (err: any) {
    console.error(
      'Failed to delete product:',
      err,
    )

    if (err.response?.data?.message) {
      error.value =
        err.response.data.message
    } else {
      error.value =
        'Gagal menghapus produk. Silakan coba lagi.'
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
      class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
    >

      <div
        class="flex items-center justify-between border-b border-gray-200 px-6 py-4"
      >
        <div>
          <h2
            class="text-lg font-semibold text-gray-900"
          >
            Delete Product
          </h2>

          <p
            class="mt-1 text-sm text-gray-500"
          >
            Hapus data produk dari sistem.
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
          class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100"
        >
          <svg
            class="h-7 w-7 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v4m0 4h.01M10.29 3.86l-7.82 13.5A2 2 0 004.2 20.5h15.6a2 2 0 001.73-3.14l-7.82-13.5a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <div class="mt-4 text-center">

          <h3
            class="text-base font-semibold text-gray-900"
          >
            Hapus produk ini?
          </h3>

          <p
            class="mt-2 text-sm leading-6 text-gray-500"
          >
            Apakah kamu yakin ingin menghapus produk
            <span
              class="font-semibold text-gray-700"
            >
              "{{ product?.name }}"
            </span>
            ?
          </p>

        </div>

        <div
          class="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3"
        >
          <p
            class="text-sm font-medium text-yellow-800"
          >
            Perhatian
          </p>

          <p
            class="mt-1 text-xs leading-5 text-yellow-700"
          >
            Produk yang sudah memiliki stock atau
            transaksi purchase tidak dapat dihapus.
          </p>
        </div>

        <div
          v-if="error"
          class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <div class="flex gap-3">

            <svg
              class="mt-0.5 h-5 w-5 shrink-0 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v4m0 4h.01M10.29 3.86l-7.82 13.5A2 2 0 004.2 20.5h15.6a2 2 0 001.73-3.14l-7.82-13.5a2 2 0 00-3.42 0z"
              />
            </svg>

            <div>
              <p
                class="text-sm font-medium text-red-700"
              >
                Produk tidak dapat dihapus
              </p>

              <p
                class="mt-1 text-xs leading-5 text-red-600"
              >
                {{ error }}
              </p>
            </div>

          </div>
        </div>

        <div
          class="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5"
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
            type="button"
            :disabled="loading"
            class="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            @click="handleDelete"
          >
            <span v-if="loading">
              Deleting...
            </span>

            <span v-else>
              Delete Product
            </span>
          </button>

        </div>

      </div>
    </div>
  </div>
</template>