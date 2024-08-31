<script setup lang="ts">

import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field'
import { Label } from '@/components/ui/label'
import CurrencySelectionCombobox from '@/components/ListingCreation/CurrencySelectionCombobox.vue'
import { computed, ref } from 'vue'

const currencySelectorRef = ref<typeof CurrencySelectionCombobox | null>(null)
const price = ref<number>(100)

const params = computed(() => {
  return {
    type: 'sale',
    price: price.value,
    currency: currencySelectorRef.value?.selectedCurrency
  }
})

defineExpose({
  params
})

</script>

<template>
  <div class="ap-mt-2">
    <Label for="price" class="ap-mb-1 ap-text-xs ap-text-muted-foreground">Asking price</Label>
    <div class="ap-flex ap-gap-1 ap-items-center">
      <NumberField
          id="price"
          :model-value="price"
          :format-options="{
        style: 'decimal',
        minimumFractionDigits: 2
      }"
          class="ap-flex-1"
          @update:modelValue="(value) => price = value"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <CurrencySelectionCombobox ref="currencySelectorRef"/>
    </div>
  </div>
</template>

<style scoped>

</style>