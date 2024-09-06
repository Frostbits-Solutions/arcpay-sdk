import type { AppProvider } from '@/lib/app/AppProvider'
import type { WalletAccount } from "@txnlab/use-wallet";
import router from '@/router'
import type { Database } from '@/lib/supabase/database.types'
import type { AssetMetadata } from '@/lib/types'

export type ListingType = 'sale' | 'auction' | 'dutch'

export interface CreateListingOptions {
  assetId?: string
  listingName?: string
  listingType?: ListingType
}

export interface SaleParams {
  type: 'sale',
  asset: AssetMetadata,
  price: number,
  currency: Database['public']['Tables']['currencies']['Row'] | undefined
}

export interface AuctionParams {
  type: 'auction',
  asset: AssetMetadata,
  price: number,
  duration: number,
  currency: Database['public']['Tables']['currencies']['Row'] | undefined
}

export interface DutchParams {
  type: 'dutch',
  asset: AssetMetadata,
  priceMin: number,
  priceMax: number,
  duration: number,
  currency: Database['public']['Tables']['currencies']['Row'] | undefined
}

export type ListingCreationParams = SaleParams | AuctionParams | DutchParams

export function createListing(appProvider: AppProvider, account: WalletAccount, options?: CreateListingOptions) {
  return new Promise<ListingCreationParams>((resolve, reject) => {
    appProvider.provide('ListingCreation', {account, options}, (params: ListingCreationParams, error?: Error) => {
      if (error) reject(error)
      resolve(params)
    })
    router.push({name: 'listing-creation'})
  })
}
