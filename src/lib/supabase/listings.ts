import {SupabaseClient} from '@supabase/supabase-js'
import type {Database} from '@/lib/supabase/database.types'

export async function getListings(client: SupabaseClient) {
    const {data, error} = await client
        .from('listings')
        .select('*, auctions(*), sales(*), dutch_auctions(*)').returns<Database['public']['Tables']['listings']['Row'][]>()
    return {data, error}
}

export async function getListingById(client: SupabaseClient, listingId: string) {
    const {
        data,
        error
    } = await client.rpc('get_listing_by_id', {listing_id: listingId}).returns<Database['public']['Functions']['get_listing_by_id']['Returns']>()
    return {data, error}
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
    currency: Database["public"]["Tables"]["listings"]["Row"]["currency"],
    name: Database["public"]["Tables"]["listings"]["Row"]["name"],
    seller_address: Database["public"]["Tables"]["listings"]["Row"]["seller_address"],
    tags: Database["public"]["Tables"]["listings"]["Row"]["tags"],
    duration: Database["public"]["Tables"]["auctions"]["Row"]["duration"],
    start_price: Database["public"]["Tables"]["auctions"]["Row"]["start_price"],
    increment: Database["public"]["Tables"]["auctions"]["Row"]["increment"],
) {
    const {data: listingData, error: listingError} = await client
        .from('listings')
        .insert({
            account_id,
            seller_address,
            currency,
            app_id,
            asset_id,
            name,
            asset_thumbnail,
            asset_type,
            asset_qty,
            asset_creator,
            tags,
            chain,
            type: 'auction',
            status: 'pending',
        })
        .select().returns<Database['public']['Tables']['listings']['Row'][]>()

    const listingId = listingData?.[0].id
    if (listingError || !listingId) return {data: null, listingError}

    const {data, error} = await client
        .from('auctions')
        .insert({
            listing_id: listingId,
            start_price,
            increment,
            duration,
        })
        .select().returns<Database['public']['Tables']['auctions']['Row'][]>()
    return {data, error}
}

export async function createDutchAuction(
    client: SupabaseClient,
    account_id: Database["public"]["Tables"]["listings"]["Row"]["account_id"],
    app_id: Database["public"]["Tables"]["listings"]["Row"]["app_id"],
    asset_creator: Database["public"]["Tables"]["listings"]["Row"]["asset_creator"],
    asset_id: Database["public"]["Tables"]["listings"]["Row"]["asset_id"],
    asset_qty: Database["public"]["Tables"]["listings"]["Row"]["asset_qty"],
    asset_thumbnail: Database["public"]["Tables"]["listings"]["Row"]["asset_thumbnail"],
    asset_type: Database["public"]["Enums"]["assets_types"],
    chain: Database["public"]["Enums"]["chains"],
    currency: Database["public"]["Tables"]["listings"]["Row"]["currency"],
    name: Database["public"]["Tables"]["listings"]["Row"]["name"],
    seller_address: Database["public"]["Tables"]["listings"]["Row"]["seller_address"],
    tags: Database["public"]["Tables"]["listings"]["Row"]["tags"],
    duration: Database["public"]["Tables"]["dutch_auctions"]["Row"]["duration"],
    min_price: Database["public"]["Tables"]["dutch_auctions"]["Row"]["min_price"],
    max_price: Database["public"]["Tables"]["dutch_auctions"]["Row"]["max_price"],
) {
    const {data: listingData, error: listingError} = await client
        .from('listings')
        .insert({
            account_id,
            seller_address,
            currency,
            app_id,
            asset_id,
            name,
            asset_thumbnail,
            asset_type,
            asset_qty,
            asset_creator,
            tags,
            chain,
            type: 'dutch',
            status: 'pending',
        })
        .select().returns<Database['public']['Tables']['listings']['Row'][]>()

    const listingId = listingData?.[0].id
    if (listingError || !listingId) return {data: null, listingError}

    const {data, error} = await client
        .from('dutch_auctions')
        .insert({
            listing_id: listingId,
            min_price,
            max_price,
            duration,
        })
        .select().returns<Database['public']['Tables']['auctions']['Row'][]>()
    return {data, error}
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
    currency: Database["public"]["Tables"]["listings"]["Row"]["currency"],
    name: Database["public"]["Tables"]["listings"]["Row"]["name"],
    seller_address: Database["public"]["Tables"]["listings"]["Row"]["seller_address"],
    tags: Database["public"]["Tables"]["listings"]["Row"]["tags"],
    price: Database["public"]["Tables"]["sales"]["Row"]["price"],
) {
    const {data: listingData, error: listingError} = await client
        .from('listings')
        .insert({
            account_id,
            seller_address,
            currency,
            app_id,
            asset_id,
            name,
            asset_thumbnail,
            asset_type,
            asset_qty,
            asset_creator,
            tags,
            chain,
            type: 'sale',
            status: 'pending',
        })
        .select().returns<Database['public']['Tables']['listings']['Row'][]>()

    const listingId = listingData?.[0].id
    if (listingError || !listingId) return {data: null, listingError}

    const {data, error} = await client
        .from('sales')
        .insert({
            listing_id: listingId,
            price,
        })
        .select().returns<Database['public']['Tables']['sales']['Row'][]>()
    return {data, error}
}
