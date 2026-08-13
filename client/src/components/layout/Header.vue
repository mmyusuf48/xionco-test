<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const sidebarOpen = defineModel<boolean>('sidebarOpen', {
  default: false,
})

const pageTitle = () => {
  switch (route.path) {
    case '/':
      return 'Dashboard'

    case '/products':
      return 'Products'

    case '/stocks':
      return 'Stock'

    case '/purchases':
      return 'Purchases'

    default:
      return 'Dashboard'
  }
}
</script>

<template>
  <header
    class="fixed left-64 right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6"
  >
    <div class="flex items-center">

      <button
        type="button"
        class="mr-4 flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
        @click="sidebarOpen = !sidebarOpen"
      >
        ☰
      </button>

      <div>
        <h2 class="text-lg font-semibold text-gray-900">
          {{ pageTitle() }}
        </h2>

      </div>
    </div>


    <div class="flex items-center gap-4">

      <div class="hidden items-center pl-4 sm:flex">

        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-sm font-semibold text-white"
        >
          AD
        </div>

        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">
            Administrator
          </p>

          <p class="text-xs text-gray-500">
            Admin
          </p>
        </div>

      </div>

    </div>
  </header>
</template>