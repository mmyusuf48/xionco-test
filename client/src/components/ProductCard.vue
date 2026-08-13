<script setup lang="ts">
interface Product {
  id: string
  name: string
  description?: string | null
  price: number | string
  created_at?: string
}

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  detail: [product: Product]
  edit: [product: Product]
  delete: [product: Product]
}>()

const formatPrice = (price: number | string) => {
  return Number(price).toLocaleString('id-ID')
}
</script>

<template>
  <div
    class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
  >
    <!-- Product Name -->
    <h3 class="text-lg font-semibold text-gray-900">
      {{ product.name }}
    </h3>

    <!-- Description -->
    <p
      class="mt-2 min-h-10 text-sm leading-relaxed text-gray-500"
    >
      {{ product.description || 'Tidak ada deskripsi produk.' }}
    </p>

    <!-- Price -->
    <div class="mt-4">
      <p
        class="text-xs font-medium uppercase tracking-wide text-gray-400"
      >
        Harga
      </p>

      <p class="mt-1 text-xl font-bold text-cyan-600">
        Rp {{ formatPrice(product.price) }}
      </p>
    </div>

    <!-- Actions -->
    <div class="mt-5 flex gap-2">

      <!-- Detail -->
      <button
        type="button"
        class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        @click="emit('detail', product)"
      >
        Detail
      </button>

      <!-- Edit -->
      <button
        type="button"
        class="flex-1 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700 transition hover:bg-yellow-100"
        @click="emit('edit', product)"
      >
        Edit
      </button>

      <!-- Delete -->
      <button
        type="button"
        class="flex-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
        @click="emit('delete', product)"
      >
        Delete
      </button>

    </div>
  </div>
</template>