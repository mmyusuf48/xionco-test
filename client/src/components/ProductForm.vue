<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'

interface Product {
  id: string
  name: string
  price: number | string
  description?: string | null
  created_at?: string
}

const props = defineProps<{
  product?: Product | null
  isEdit?: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const name = ref('')
const price = ref<number | null>(null)
const displayPrice = ref('')
const description = ref('')

const loading = ref(false)
const error = ref('')

const API_URL = 'http://localhost:3000/api/products'

/**
 * Format angka
 *
 */
const formatRupiah = (value: number | null) => {
  if (value === null || value === undefined) {
    return ''
  }

  return new Intl.NumberFormat('id-ID').format(value)
}

/**
 * Isi / reset form ketika product atau mode berubah
 */
watch(
  () => ({
    product: props.product,
    isEdit: props.isEdit,
  }),
  ({ product, isEdit }) => {
    error.value = ''

    if (isEdit && product) {
      // EDIT MODE

      name.value = product.name ?? ''

      const numericPrice = Number(product.price)

      price.value = Number.isFinite(numericPrice)
        ? numericPrice
        : null

      displayPrice.value = formatRupiah(price.value)

      description.value = product.description ?? ''
    } else {
      // CREATE MODE

      name.value = ''
      price.value = null
      displayPrice.value = ''
      description.value = ''
    }
  },
  {
    immediate: true,
  },
)

/**
 * Handle input harga
 */
const handlePriceInput = (event: Event) => {
  const target = event.target as HTMLInputElement

  const numericValue = target.value.replace(/\D/g, '')

  if (!numericValue) {
    price.value = null
    displayPrice.value = ''
    return
  }

  const numericPrice = Number(numericValue)

  price.value = numericPrice

  displayPrice.value = formatRupiah(numericPrice)
}

/**
 * Submit Product
 */
const submit = async () => {
  error.value = ''

  // Validasi nama
  if (!name.value.trim()) {
    error.value = 'Nama produk wajib diisi.'
    return
  }

  // Validasi harga
  if (price.value === null || price.value <= 0) {
    error.value = 'Harga produk harus lebih dari 0.'
    return
  }

  try {
    loading.value = true

    const payload = {
      name: name.value.trim(),
      price: price.value,
      description: description.value.trim() || null,
    }

    if (props.isEdit && props.product) {
      // UPDATE
      await axios.put(
        `${API_URL}/${props.product.id}`,
        payload,
      )
    } else {
      // CREATE
      await axios.post(
        API_URL,
        payload,
      )
    }

    emit('success')

    // Tutup modal
    emit('close')
  } catch (err: any) {
    console.error('Failed to save product:', err)

    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Gagal menyimpan produk. Silakan coba lagi.'
    }
  } finally {
    loading.value = false
  }
}

/**
 * Close modal
 */
const handleClose = () => {
  if (loading.value) {
    return
  }

  emit('close')
}
</script>

<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    @click.self="handleClose"
  >
    <!-- Modal -->
    <div
      class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between border-b border-gray-200 px-6 py-4"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Edit Product' : 'Add Product' }}
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            {{
              isEdit
                ? 'Perbarui informasi produk.'
                : 'Tambahkan produk baru ke dalam sistem.'
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

      <!-- Form -->
      <form
        class="space-y-5 p-6"
        @submit.prevent="submit"
      >
        <!-- Error -->
        <div
          v-if="error"
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>

        <!-- Product Name -->
        <div>
          <label
            for="product-name"
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Product Name

            <span class="text-red-500">*</span>
          </label>

          <input
            id="product-name"
            v-model="name"
            type="text"
            placeholder="Contoh: Laptop Office"
            :disabled="loading"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-gray-100"
          />
        </div>

        <!-- Price -->
        <div>
          <label
            for="product-price"
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Price

            <span class="text-red-500">*</span>
          </label>

          <div class="relative">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              Rp
            </span>

            <input
              id="product-price"
              :value="formatRupiah(price)"
              type="text"
              inputmode="numeric"
              placeholder="0"
              :disabled="loading"
              class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-gray-100"
              @input="handlePriceInput"
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label
            for="product-description"
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="product-description"
            v-model="description"
            rows="4"
            placeholder="Masukkan deskripsi produk..."
            :disabled="loading"
            class="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-gray-100"
          />
        </div>

        <!-- Footer -->
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
              {{ isEdit ? 'Update Product' : 'Save Product' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>