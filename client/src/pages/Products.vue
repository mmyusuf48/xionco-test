<script setup lang="ts">
import { ref } from 'vue'
import ProductList from '../components/ProductList.vue'
import ProductForm from '../components/ProductForm.vue'
import ProductDetail from '../components/ProductDetail.vue'

const showForm = ref(false)
const showDetail = ref(false)
const isEdit = ref(false)

const selectedProduct = ref<any>(null)

const refreshKey = ref(0)

const handleSuccess = () => {
  showForm.value = false
  refreshKey.value++
}

const handleAdd = () => {
  selectedProduct.value = null
  isEdit.value = false
  showForm.value = true
}

const handleDetail = (product: any) => {
  selectedProduct.value = product
  showDetail.value = true
}

const handleEdit = (product: any) => {
  selectedProduct.value = product
  isEdit.value = true
  showForm.value = true
}

const handleCloseForm = () => {
  showForm.value = false
  selectedProduct.value = null
}

const handleCloseDetail = () => {
  showDetail.value = false
  selectedProduct.value = null
}
</script>

<template>
  <div>

    <!-- Page Header -->
    <div class="mb-6 flex items-start justify-between">

      <div>
        <h1 class="text-2xl font-semibold text-gray-900">
          Products
        </h1>

        <p class="mt-1 text-sm text-gray-500">
          Kelola daftar produk yang tersedia.
        </p>
      </div>

      <button
        type="button"
        @click="handleAdd"
        class="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600"
      >
        <span class="mr-2 text-lg">
          +
        </span>

        Add Product
      </button>

    </div>

    <!-- Product List -->
    <div
      class="rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div class="border-b border-gray-200 px-6 py-4">
        <h2 class="text-base font-semibold text-gray-900">
          Product List
        </h2>

        <p class="mt-1 text-sm text-gray-500">
          Daftar produk yang tersedia di sistem.
        </p>
      </div>

      <div class="p-6">

        <ProductList
          :key="refreshKey"
          @detail="handleDetail"
          @edit="handleEdit"
        />

      </div>
    </div>

    <!-- Form -->
    <ProductForm
      v-if="showForm"
      :product="selectedProduct"
      :isEdit="isEdit"
      @close="handleCloseForm"
      @success="handleSuccess"
    />

    <!-- Detail -->
    <ProductDetail
      v-if="showDetail"
      :product="selectedProduct"
      @close="handleCloseDetail"
    />

  </div>
</template>