<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { CaretSortIcon, CheckIcon } from '@radix-icons/vue'
import defaultCurrencyIcon from '@/assets/currency.svg'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import type { SupabaseClient } from '@supabase/supabase-js'
import { type Database } from '@/lib/supabase/database.types'
import { getCurrencies } from '@/lib/supabase/currencies'
import type {NetworksConfig} from '@/lib/algod/networks.config'

const supabase = inject<SupabaseClient>('supabase')
const network = inject<NetworksConfig>('network')
const currencies = ref<Database['public']['Tables']['currencies']['Row'][]>([])
const selectedCurrency = computed(() => {
  return currencies.value.find((currency) => currency.ticker === value.value)
})
const open = ref(false)
const value = ref<string | undefined>(network?.chain)
const loading = ref(true)

function fetchCurrencies() {
  if (!supabase) throw new Error('Unexpected error: supabase is undefined')
  if (!network) throw new Error('Unexpected error: supabase is undefined')
  loading.value = true
  getCurrencies(supabase, network.key).then(({data, error}) => {
    if (data) {
      currencies.value = data
    } else {
      console.error(`Unable to fetch currencies: ${error || 'unexpected error'}`)
    }
    loading.value = false
  }).catch((error) => {
    console.error(`Unable to fetch currencies: ${error || 'unexpected error'}`)
  })
}

defineExpose({
  selectedCurrency,
})

onMounted(() => {
  fetchCurrencies()
})
</script>

<template>
  <Popover v-model:open="open" v-if="!loading">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="ap-justify-between ap-w-[120px] ap-p-1"
        size="lg"
      >
        <template v-if="!value">
          Select currency
        </template>
        <template v-else-if="selectedCurrency">
          <div class="ap-flex ap-items-center ap-gap-1 ap-min-w-0 ap-px-1">
            <img :src="selectedCurrency?.icon || defaultCurrencyIcon" :alt="`${selectedCurrency.ticker} icon`" class="ap-h-5 ap-w-5 ap-rounded-full ap-bg-border" />
            <div class="ap-text-xs ap-text-muted-foreground ap-min-w-0">
              <div class="ap-font-semibold ap-text-foreground ap-truncate">{{ selectedCurrency.ticker.toUpperCase() }}</div>
            </div>
          </div>
        </template>
        <CaretSortIcon class="ap-ml-2 ap-h-4 ap-w-4 ap-shrink-0 ap-opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="ap-p-0 ap-w-[334px] ap-h-[250px]" side="bottom" align="end" >
      <Command>
        <CommandInput class="ap-h-9" placeholder="Search by ticker" />
        <CommandEmpty>No currency found.</CommandEmpty>
        <CommandList>
          <CommandGroup class="ap-w-[327px]">
            <CommandItem
              v-for="currency in currencies"
              :key="currency.id"
              :value="currency.ticker"
              @select="(ev) => {
                if (typeof ev.detail.value === 'string') {
                  value = ev.detail.value
                }
                open = false
              }">
              <div class="ap-flex ap-items-center ap-gap-1 ap-min-w-0">
                <img :src="currency?.icon || defaultCurrencyIcon" :alt="`${currency.ticker} icon`" class="ap-h-5 ap-w-5 ap-rounded-full ap-bg-border" />
                <div class="ap-text-xs ap-text-muted-foreground ap-min-w-0">
                  <div class="ap-font-semibold ap-text-foreground ap-truncate">{{ currency.ticker.toUpperCase() }}</div>
                  ID: {{ currency.id }}
                </div>
              </div>
              <CheckIcon :class="cn('ap-ml-auto ap-h-4 ap-w-4',value === currency.ticker ? 'ap-opacity-100' : 'ap-opacity-0',)"/>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
  <Skeleton v-else class="ap-w-[120px] ap-h-9 ap-p-2" />
</template>