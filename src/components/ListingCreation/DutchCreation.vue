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
const priceMin = ref<number>(1)
const priceMax = ref<number>(100)
const duration = ref<number>(7)

const params = computed(() => {
  return {
    type: 'sale',
    priceMin: priceMin.value,
    priceMax: priceMax.value,
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
    <Label for="priceMin" class="ap-text-xs ap-text-muted-foreground">Asking price</Label>
    <div class="ap-flex ap-gap-1 ap-items-top ap-mt-1 ap-w-[333px]">
      <div>
        <div class="ap-flex ap-items-center ap-gap-2">
          <span class="ap-text-xs ap-text-muted-foreground/50">Min</span>
          <NumberField
              id="priceMin"
              :model-value="priceMin"
              :format-options="{
              style: 'decimal',
              minimumFractionDigits: 2
            }"
              class="ap-flex-1"
              @update:modelValue="(value) => priceMin = value"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
        <div class="ap-flex ap-items-center ap-gap-1 ap-mt-1">
          <span class="ap-text-xs ap-text-muted-foreground/50">Max</span>
          <NumberField
              id="priceMax"
              :model-value="priceMax"
              :format-options="{
              style: 'decimal',
              minimumFractionDigits: 2
            }"
              class="ap-flex-1"
              @update:modelValue="(value) => priceMax = value"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
      </div>
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
        class="ap-flex-1"
        @update:modelValue="(value) => duration = value"
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