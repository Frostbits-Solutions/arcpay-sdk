import type { AppProvider } from '@/lib/app/AppProvider'
import type { WalletAccount } from "@txnlab/use-wallet";
import router from '@/router'
import type { Database } from '@/lib/supabase/database.types'
import type { OnChainAssetMetadata } from '@/lib/types'

export interface CreateListingOptions {
  assetId?: string
  listingName?: string
}

export interface SaleParams {
  type: 'sale',
  asset: OnChainAssetMetadata,
  price: number,
  currency: Database['public']['Tables']['currencies']['Row'] | undefined
}

export interface AuctionParams {
  type: 'sale',
  asset: OnChainAssetMetadata,
  price: number,
  duration: number,
  currency: Database['public']['Tables']['currencies']['Row'] | undefined
}

export type ListingCreationParams = SaleParams | AuctionParams

export function createListing(appProvider: AppProvider, account: WalletAccount, options?: CreateListingOptions) {
  return new Promise<ListingCreationParams>((resolve, reject) => {
    appProvider.provide('ListingCreation', {account, options}, (params: ListingCreationParams, error?: Error) => {
      if (error) reject(error)
      resolve(params)
    })
    router.push({name: 'listing-creation'})
  })
}