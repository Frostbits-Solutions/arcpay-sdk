<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import {ref} from "vue";
import type {ListingParams} from "@/lib/app/reviewListing";
import {Button} from "@/components/ui/button";
import {Link2, Check} from "lucide-vue-next";

const props = defineProps<{ listingParams: ListingParams }>()

const source = ref<string>(props.listingParams?.id || '')
const { copy, copied, isSupported } = useClipboard({ source })
</script>

<template>
    <div v-if="isSupported" @click="copy(source)" class="ap-w-full ap-text-center ap-absolute -ap-bottom-12 ap-left-0">
        <Button variant="ghost" class="ap-px-1 ap-rounded ap-h-6 ap-text-muted-foreground/30">
            <Check v-if="copied" class="ap-w-4 ap-h-4 ap-text-green-500 ap-mr-1"/>
            <Link2 v-else class="ap-w-4 ap-h-4 ap-mr-1"/>
            {{ source }}
        </Button>
    </div>
</template>