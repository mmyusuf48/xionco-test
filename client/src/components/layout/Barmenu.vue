<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menus = [
  {
    name: 'Dashboard',
    path: '/',
    icon: '▦',
  },
  {
    name: 'Products',
    path: '/products',
    icon: '▣',
  },
  {
    name: 'Stock',
    path: '/stocks',
    icon: '□',
  },
  {
    name: 'Purchases',
    path: '/purchases',
    icon: '▤',
  },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white"
  >

    <div class="flex h-20 items-center border-b border-gray-200 px-6">

      <div
        class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-lg font-bold text-white"
      >
        X
      </div>

      <div class="ml-3">
        <div class="text-lg font-bold text-gray-900">
          XIONCO
        </div>

        <div class="text-xs text-gray-500">
          Admin System
        </div>
      </div>

    </div>

    <nav class="flex-1 px-4 py-6">

      <p class="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Menu Utama
      </p>

      <div class="space-y-1">

        <button
          v-for="menu in menus"
          :key="menu.path"
          type="button"
          @click="router.push(menu.path)"
          class="flex w-full items-center rounded-lg px-3 py-3 text-left text-sm font-medium transition"
          :class="
            isActive(menu.path)
              ? 'bg-cyan-500 text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          "
        >

          <span class="flex w-8 items-center justify-center text-lg">
            {{ menu.icon }}
          </span>

          <span class="ml-3">
            {{ menu.name }}
          </span>

        </button>

      </div>

    </nav>

  </aside>
</template>