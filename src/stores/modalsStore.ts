import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useModalsStore = defineStore('modals', () => {
  const states: Ref<{[key: string]: boolean}> = ref({})

  function registerModal(modalName: string | undefined) {
    if (modalName) states.value[modalName] = false
  }

  function showModal(modalName: string | undefined) {
    if (modalName) states.value[modalName] = true
  }

  function hideModal(modalName: string | undefined) {
    if (modalName) states.value[modalName] = false
  }

  return { states, registerModal, showModal, hideModal }
})
