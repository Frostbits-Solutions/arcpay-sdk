import type {AppProvider} from '@/lib/app/AppProvider'
import router from '@/router'
import type {Database} from '@/lib/supabase/database.types'


export type ListingParams = Database['public']['Functions']['get_listing_by_id']['Returns']

export function reviewListing(appProvider: AppProvider, listingParams: ListingParams) {
    return new Promise<number>((resolve, reject) => {
        appProvider.provide('ListingReview', {listingParams}, (price: number, error?: Error) => {
            if (error) reject(error)
            resolve(price)
        })
        router.push({name: 'listing-review'})
    })
}