<script setup lang="ts">
import type {ListingParams} from "@/lib/app/reviewListing";
import {onMounted, ref} from "vue";
import {Skeleton} from "@/components/ui/skeleton";

const props = defineProps<{ listingParams: ListingParams, previewLink: string }>()
const loaded = ref(false)
const img = ref(new Image())

async function loadThumbnail() {
    if (props.listingParams.asset_thumbnail) {
        img.value.src = props.listingParams.asset_thumbnail
        img.value.onload = () => {
            loaded.value = true
        }
        img.value.onerror = () => {
            console.error('Failed to load thumbnail')
        }
    } else {
        console.error('No thumbnail provided')
    }
}

onMounted(() => {
    loadThumbnail()
})
</script>

<template>
    <a :href="previewLink"
       class="ap-block ap-max-w-[275px] ap-max-h-[275px] ap-relative ap-rounded-2xl ap-overflow-hidden ap-shadow-2xl ap-border ap-border-border ap-transition-all"
       target="_blank">
        <img
                v-if="loaded && listingParams.asset_thumbnail"
                :alt="listingParams.asset_id || 'Asset'"
                :src="listingParams.asset_thumbnail"
                class="ap-object-cover"
                v-motion-fade
        />
        <Skeleton v-else class="ap-w-[275px] ap-h-[275px]"/>
    </a>
</template>

<style scoped>

</style>