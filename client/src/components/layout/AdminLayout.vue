<script setup lang="ts">
import Sidebar from './Barmenu.vue'
import Header from './Header.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <Sidebar />

    <div class="min-h-screen pl-64">

      <Header />

      <main class="pt-20">
        <div class="p-6">
          <slot />
        </div>
      </main>

    </div>

  </div>
</template>