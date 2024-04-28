<script setup lang="ts">
import Modal from '@/components/ModalComponent.vue'
</script>

<template>
  <Modal modal-name="root">
    <template #body>
      <router-view/>
    </template>
  </Modal>
</template>

<style scoped>
</style>
