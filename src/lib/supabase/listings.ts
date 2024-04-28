import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

export async function getListings(client: SupabaseClient) {
  const { data, error } = await client
    .from('listings')
    .select('*, auctions(*), sales(*)')
  return { data, error }
}

export async function getListingById(client: SupabaseClient, listing_id: string) {
  const { data, error } = await client.rpc('get_listing_by_id', { listing_id })
  return { data, error }
}

export async function createAuction(
    client: SupabaseClient,
    account_id: Database["public"]["Tables"]["listings"]["Row"]["account_id"],
    app_id: Database["public"]["Tables"]["listings"]["Row"]["app_id"],
    asset_creator: Database["public"]["Tables"]["listings"]["Row"]["asset_creator"],
    asset_id: Database["public"]["Tables"]["listings"]["Row"]["asset_id"],
    asset_qty: Database["public"]["Tables"]["listings"]["Row"]["asset_qty"],
    asset_thumbnail: Database["public"]["Tables"]["listings"]["Row"]["asset_thumbnail"],
    asset_type: Database["public"]["Enums"]["assets_types"],
    chain: Database["public"]["Enums"]["chains"],
    listing_currency: Database["public"]["Tables"]["listings"]["Row"]["listing_currency"],
    listing_name: Database["public"]["Tables"]["listings"]["Row"]["listing_name"],
    seller_address: Database["public"]["Tables"]["listings"]["Row"]["seller_address"],
    tags: Database["public"]["Tables"]["listings"]["Row"]["tags"],
    duration: Database["public"]["Tables"]["auctions"]["Row"]["duration"],
    min_increment: Database["public"]["Tables"]["auctions"]["Row"]["min_increment"],
    start_price: Database["public"]["Tables"]["auctions"]["Row"]["start_price"],
    type: Database["public"]["Enums"]["auctions_type"]
) {
    const { data: listingData, error: listingError } = await client
        .from('listings')
        .insert({
            account_id,
            seller_address,
            listing_currency,
            app_id,
            asset_id,
            listing_name,
            asset_thumbnail,
            asset_type,
            asset_qty,
            asset_creator,
            tags,
            chain,
            listing_type: 'auction',
            status: 'pending',
        })
        .select()

    const listingId = listingData?.[0].id
    if (listingError || !listingId) return { data: null, listingError }

    const { data, error } = await client
        .from('auctions')
        .insert({
            listing_id: listingId,
            start_price,
            min_increment,
            duration,
            type,
        })
        .select()
    return { data, error }
}

export async function createSale(
    client: SupabaseClient,
    account_id: Database["public"]["Tables"]["listings"]["Row"]["account_id"],
    app_id: Database["public"]["Tables"]["listings"]["Row"]["app_id"],
    asset_creator: Database["public"]["Tables"]["listings"]["Row"]["asset_creator"],
    asset_id: Database["public"]["Tables"]["listings"]["Row"]["asset_id"],
    asset_qty: Database["public"]["Tables"]["listings"]["Row"]["asset_qty"],
    asset_thumbnail: Database["public"]["Tables"]["listings"]["Row"]["asset_thumbnail"],
    asset_type: Database["public"]["Enums"]["assets_types"],
    chain: Database["public"]["Enums"]["chains"],
    listing_currency: Database["public"]["Tables"]["listings"]["Row"]["listing_currency"],
    listing_name: Database["public"]["Tables"]["listings"]["Row"]["listing_name"],
    seller_address: Database["public"]["Tables"]["listings"]["Row"]["seller_address"],
    tags: Database["public"]["Tables"]["listings"]["Row"]["tags"],
    asking_price: Database["public"]["Tables"]["sales"]["Row"]["asking_price"]
) {
    const { data: listingData, error: listingError } = await client
        .from('listings')
        .insert({
            account_id,
            seller_address,
            listing_currency,
            app_id,
            asset_id,
            listing_name,
            asset_thumbnail,
            asset_type,
            asset_qty,
            asset_creator,
            tags,
            chain,
            listing_type: 'sale',
            status: 'pending',
        })
        .select()

    const listingId = listingData?.[0].id
    if (listingError || !listingId) return { data: null, listingError }

    const { data, error } = await client
        .from('sales')
        .insert({
            listing_id: listingId,
            asking_price,
        })
        .select()
    return { data, error }
}
