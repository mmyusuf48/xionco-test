<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import ProductDeleteModal from './ProductDeleteModal.vue'

interface Product {
  id: string
  name: string
  description?: string | null
  price: number | string
  created_at?: string
}

const products = ref<Product[]>([])
const loading = ref(false)
const error = ref('')

const showDeleteModal = ref(false)
const selectedProduct = ref<Product | null>(null)

const emit = defineEmits<{
  detail: [product: Product]
  edit: [product: Product]
}>()

const API_URL =
  'http://localhost:3000/api/products'

const fetchProducts = async () => {
  try {
    loading.value = true
    error.value = ''

    const res = await axios.get(API_URL)

    products.value = Array.isArray(res.data)
      ? res.data
      : res.data.data ?? []
  } catch (err) {
    console.error(
      'Failed to fetch products:',
      err,
    )

    error.value =
      'Gagal mengambil data produk.'
  } finally {
    loading.value = false
  }
}

const handleDelete = (
  product: Product,
) => {
  selectedProduct.value = product
  showDeleteModal.value = true
}

const handleDeleteSuccess = async () => {
  showDeleteModal.value = false
  selectedProduct.value = null

  await fetchProducts()
}

const handleDeleteClose = () => {
  if (loading.value) {
    return
  }

  showDeleteModal.value = false
  selectedProduct.value = null
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

onMounted(() => {
  fetchProducts()
})

defineExpose({
  fetchProducts,
})
</script>

<template>
  <div>

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
          Memuat produk...
        </p>

      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-xl border border-red-200 bg-red-50 p-5"
    >
      <p
        class="text-sm font-medium text-red-700"
      >
        {{ error }}
      </p>

      <button
        type="button"
        class="mt-3 text-sm font-medium text-red-700 underline"
        @click="fetchProducts"
      >
        Coba lagi
      </button>
    </div>

    <!-- Empty -->
    <div
      v-else-if="products.length === 0"
      class="flex min-h-48 items-center justify-center"
    >
      <div class="text-center">

        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400"
        >
          —
        </div>

        <p
          class="mt-4 text-sm font-semibold text-gray-700"
        >
          Belum ada produk
        </p>

        <p
          class="mt-1 text-sm text-gray-500"
        >
          Tambahkan produk untuk mulai mengelola data.
        </p>

      </div>
    </div>

    <!-- Product Table -->
    <div
      v-else
      class="overflow-x-auto"
    >
      <table
        class="w-full min-w-[900px]"
      >

        <thead>
          <tr
            class="border-b border-gray-200"
          >

            <!-- Product -->
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Product
            </th>

            <!-- Description -->
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Description
            </th>

            <!-- Price -->
            <th
              class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Price
            </th>

            <!-- Date -->
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Created
            </th>

            <!-- Action -->
            <th
              class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Action
            </th>

          </tr>
        </thead>

        <tbody
          class="divide-y divide-gray-100"
        >

          <tr
            v-for="product in products"
            :key="product.id"
            class="transition hover:bg-gray-50"
          >

            <!-- Product -->
            <td
              class="px-4 py-4"
            >
              <div>

                <p
                  class="text-sm font-semibold text-gray-900"
                >
                  {{ product.name }}
                </p>

                <p
                  class="mt-1 text-xs text-gray-400"
                >
                  ID: {{ product.id }}
                </p>

              </div>
            </td>

            <!-- Description -->
            <td
              class="max-w-[300px] px-4 py-4"
            >
              <p
                class="truncate text-sm text-gray-600"
                :title="product.description || '-'"
              >
                {{
                  product.description ||
                  '-'
                }}
              </p>
            </td>

            <!-- Price -->
            <td
              class="px-4 py-4 text-right"
            >
              <span
                class="text-sm font-medium text-gray-900"
              >
                Rp
                {{
                  formatPrice(
                    product.price,
                  )
                }}
              </span>
            </td>

            <!-- Created -->
            <td
              class="px-4 py-4"
            >
              <span
                class="text-sm text-gray-600"
              >
                {{
                  formatDate(
                    product.created_at,
                  )
                }}
              </span>
            </td>

            <!-- Action -->
            <td
              class="px-4 py-4"
            >
              <div
                class="flex items-center justify-center gap-2"
              >

                <!-- Detail -->
                <button
                  type="button"
                  class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  @click="
                    emit(
                      'detail',
                      product,
                    )
                  "
                >
                  Detail
                </button>

                <!-- Edit -->
                <button
                  type="button"
                  class="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-700 transition hover:bg-cyan-100"
                  @click="
                    emit(
                      'edit',
                      product,
                    )
                  "
                >
                  Edit
                </button>

                <!-- Delete -->
                <button
                  type="button"
                  class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                  @click="
                    handleDelete(
                      product,
                    )
                  "
                >
                  Delete
                </button>

              </div>
            </td>

          </tr>

        </tbody>

      </table>
    </div>

    <!-- Delete Modal -->
    <ProductDeleteModal
      v-if="
        showDeleteModal &&
        selectedProduct
      "
      :product="selectedProduct"
      @close="handleDeleteClose"
      @success="handleDeleteSuccess"
    />

  </div>
</template>