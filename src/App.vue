<script setup lang="ts">
import Modal from '@/components/ModalComponent.vue'
import { onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  nextTick(() => {
    console.log(route)
  })
})
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
