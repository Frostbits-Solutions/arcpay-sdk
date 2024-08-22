import type { AppProvider } from '@/lib/app/AppProvider'
import router from '@/router'
import type { Database } from '@/lib/supabase/database.types'


export type ListingParams = Database['public']['Functions']['get_listing_by_id']['Returns']

export function reviewListing(appProvider: AppProvider, listingParams: ListingParams) {
  return new Promise<void>((resolve) => {
    appProvider.provide('ListingReview', {listingParams}, () => {
      resolve()
    })
    router.push({name: 'listing-review'})
  })
}