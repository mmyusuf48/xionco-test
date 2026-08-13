<script setup lang="ts">
interface Product {
  id: string
  name: string
  price: number | string
  description?: string | null
  created_at?: string
}

defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  close: []
}>()

const formatPrice = (price: number | string) => {
  return Number(price).toLocaleString('id-ID')
}

const formatDate = (date?: string) => {
  if (!date) {
    return '-'
  }

  return new Date(date).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    @click.self="emit('close')"
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
            Product Detail
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            Informasi lengkap produk.
          </p>
        </div>

        <!-- Close -->
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          @click="emit('close')"
        >
          ×
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-5 p-6">
        <!-- Name -->
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
            Product Name
          </p>

          <p class="mt-1 text-base font-semibold text-gray-900">
            {{ product.name }}
          </p>
        </div>

        <!-- Price -->
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
            Price
          </p>

          <p class="mt-1 text-2xl font-bold text-cyan-600">
            Rp {{ formatPrice(product.price) }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
            Description
          </p>

          <div
            class="mt-2 rounded-lg bg-gray-50 p-4"
          >
            <p class="text-sm leading-relaxed text-gray-600">
              {{ product.description || 'Tidak ada deskripsi produk.' }}
            </p>
          </div>
        </div>

        <!-- Created At -->
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
            Created At
          </p>

          <p class="mt-1 text-sm text-gray-600">
            {{ formatDate(product.created_at) }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex justify-end border-t border-gray-100 px-6 py-4"
      >
        <button
          type="button"
          class="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>