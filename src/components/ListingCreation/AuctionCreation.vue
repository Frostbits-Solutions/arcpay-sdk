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
const duration = ref<number>(7)

const params = computed(() => {
  return {
    type: 'auction',
    price: price.value,
    duration: duration.value * 24,
    currency: currencySelectorRef.value?.selectedCurrency
  }
})

defineExpose({
  params
})

</script>

<template>
  <div class="ap-mt-2">
    <Label for="price" class="ap-text-xs ap-text-muted-foreground">Start price</Label>
    <div class="ap-flex ap-gap-1 ap-items-center ap-mt-2">
      <NumberField
          id="price"
          :model-value="price"
          :format-options="{
        style: 'decimal',
        minimumFractionDigits: 2
      }"
          class="ap-flex-1"
          @update:modelValue="(value: number) => price = value"
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
  <div class="ap-mt-2">
    <Label for="duration" class="ap-text-xs ap-text-muted-foreground">Duration</Label>
    <NumberField
        id="duration"
        :model-value="duration"
        :format-options="{
        style: 'unit',
        unit: 'day'
      }"
        class="ap-flex-1 ap-mt-2"
        @update:modelValue="(value: number) => duration = value"
    >
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </div>
</template>

<style scoped>

</style>