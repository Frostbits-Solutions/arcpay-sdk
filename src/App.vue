<template>
  <div class="w-full max-w-sm max-h-screen overflow-scroll rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:p-6 md:p-8 dark:border-gray-700 dark:bg-gray-800 animate-modal">
    <div class="mb-8 flex items-center justify-center">
      <img src="@/assets/logo.png" alt="Logo" class="w-12 h-12" />
      <h1 class="text-4xl ml-2 dark:text-white">arcpay</h1>
    </div>

    <router-view />

  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
