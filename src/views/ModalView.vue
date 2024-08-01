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
    <DialogContent @interact-outside="event => {
      const target = event.target as HTMLElement;
      console.log(target)
      if (!route.meta.closeable || target?.closest('wcm-modal')) return event.preventDefault()
    }">
      <DialogHeader>
        <DialogTitle v-if="route.meta.title">{{ route.meta.title }}</DialogTitle>
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