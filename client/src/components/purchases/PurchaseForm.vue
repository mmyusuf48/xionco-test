<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

interface Product {
  id: string
  name: string
  price: number | string
}

const emit = defineEmits<{
  close: []
  success: []
}>()

const products = ref<Product[]>([])

const productId = ref('')
const quantity = ref<number | null>(null)

const loading = ref(false)
const loadingProducts = ref(false)
const error = ref('')

const PRODUCTS_API_URL = 'http://localhost:3000/api/products'
const PURCHASES_API_URL = 'http://localhost:3000/api/purchases'

const fetchProducts = async () => {
  try {
    loadingProducts.value = true

    const res = await axios.get(PRODUCTS_API_URL)

    products.value = Array.isArray(res.data)
      ? res.data
      : res.data.data ?? []
  } catch (err) {
    console.error('Failed to fetch products:', err)

    error.value = 'Gagal mengambil data produk.'
  } finally {
    loadingProducts.value = false
  }
}

const selectedProduct = () => {
  return products.value.find(
    product => product.id === productId.value,
  )
}

const formatPrice = (price: number | string) => {
  return Number(price).toLocaleString('id-ID')
}

const submit = async () => {
  error.value = ''

  if (!productId.value) {
    error.value = 'Produk wajib dipilih.'
    return
  }

  if (
    quantity.value === null ||
    quantity.value <= 0
  ) {
    error.value = 'Quantity harus lebih dari 0.'
    return
  }

  try {
    loading.value = true

    await axios.post(PURCHASES_API_URL, {
      product_id: productId.value,
      quantity: quantity.value,
    })

    emit('success')
    emit('close')
  } catch (err: any) {
    console.error('Failed to create purchase:', err)

    error.value =
      err.response?.data?.message ||
      'Gagal membuat pembelian.'
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

onMounted(() => {
  fetchProducts()
})
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
            New Purchase
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            Tambahkan transaksi pembelian produk.
          </p>
        </div>

        <button
          type="button"
          :disabled="loading"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
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
            for="purchase-product"
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Product
            <span class="text-red-500">*</span>
          </label>

          <select
            id="purchase-product"
            v-model="productId"
            :disabled="loading || loadingProducts"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-gray-100"
          >
            <option value="">
              {{
                loadingProducts
                  ? 'Memuat produk...'
                  : 'Pilih produk'
              }}
            </option>

            <option
              v-for="product in products"
              :key="product.id"
              :value="product.id"
            >
              {{ product.name }} —
              Rp {{ formatPrice(product.price) }}
            </option>
          </select>
        </div>

        <div
          v-if="selectedProduct()"
          class="rounded-lg bg-gray-50 px-4 py-3"
        >
          <p class="text-xs text-gray-500">
            Harga Produk
          </p>

          <p class="mt-1 text-lg font-semibold text-cyan-600">
            Rp {{ formatPrice(selectedProduct()!.price) }}
          </p>

          <p class="mt-1 text-xs text-gray-400">
            Harga diambil otomatis dari data produk.
          </p>
        </div>

        <div>
          <label
            for="purchase-quantity"
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Quantity
            <span class="text-red-500">*</span>
          </label>

          <input
            id="purchase-quantity"
            v-model.number="quantity"
            type="number"
            min="1"
            placeholder="Masukkan jumlah"
            :disabled="loading"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-gray-100"
          />
        </div>

        <div
          v-if="selectedProduct() && quantity && quantity > 0"
          class="rounded-lg border border-cyan-100 bg-cyan-50 px-4 py-3"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">
              Total Pembelian
            </span>

            <span class="text-lg font-bold text-cyan-700">
              Rp
              {{
                formatPrice(
                  Number(selectedProduct()!.price) *
                  Number(quantity),
                )
              }}
            </span>
          </div>
        </div>

        <div
          class="flex justify-end gap-3 border-t border-gray-100 pt-5"
        >
          <button
            type="button"
            :disabled="loading"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            @click="handleClose"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="loading"
            class="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-60"
          >
            {{ loading ? 'Saving...' : 'Save Purchase' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>