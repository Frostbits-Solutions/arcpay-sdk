<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

function handleClose(open: boolean) {
  if (!open) {
    router.push('/')
  }
}
</script>

<template>
  <Dialog :default-open="true" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ route.meta.title }}</DialogTitle>
        <DialogDescription>
          {{ route.meta.description }}
        </DialogDescription>
      </DialogHeader>
      <router-view/>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>