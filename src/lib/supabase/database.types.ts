export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            accounts: {
                Row: {
                    created_at: string
                    id: number
                    name: string
                    owner_email: string
                    s_enable_secondary_sales: boolean
                    s_secondary_sales_fee_address: string | null
                    s_secondary_sales_percentage_fee: number | null
                    subscription_expiration_date: string | null
                    subscription_id: number
                }
                Insert: {
                    created_at?: string
                    id?: number
                    name: string
                    owner_email: string
                    s_enable_secondary_sales?: boolean
                    s_secondary_sales_fee_address?: string | null
                    s_secondary_sales_percentage_fee?: number | null
                    subscription_expiration_date?: string | null
                    subscription_id?: number
                }
                Update: {
                    created_at?: string
                    id?: number
                    name?: string
                    owner_email?: string
                    s_enable_secondary_sales?: boolean
                    s_secondary_sales_fee_address?: string | null
                    s_secondary_sales_percentage_fee?: number | null
                    subscription_expiration_date?: string | null
                    subscription_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "public_accounts_subscription_id_fkey"
                        columns: ["subscription_id"]
                        isOneToOne: false
                        referencedRelation: "subscription_tiers"
                        referencedColumns: ["id"]
                    },
                ]
            }
            accounts_addresses: {
                Row: {
                    account_id: number
                    address: string
                    chain: Database["public"]["Enums"]["chains"]
                    created_at: string
                    name: string | null
                }
                Insert: {
                    account_id: number
                    address: string
                    chain: Database["public"]["Enums"]["chains"]
                    created_at?: string
                    name?: string | null
                }
                Update: {
                    account_id?: number
                    address?: string
                    chain?: Database["public"]["Enums"]["chains"]
                    created_at?: string
                    name?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "public_accounts_addresses_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "accounts"
                        referencedColumns: ["id"]
                    },
                ]
            }
            accounts_api_keys: {
                Row: {
                    account_id: number
                    created_at: string
                    key: string
                    name: string | null
                    origin: string
                }
                Insert: {
                    account_id: number
                    created_at?: string
                    key?: string
                    name?: string | null
                    origin: string
                }
                Update: {
                    account_id?: number
                    created_at?: string
                    key?: string
                    name?: string | null
                    origin?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "public_accounts_api_keys_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "accounts"
                        referencedColumns: ["id"]
                    },
                ]
            }
            accounts_users_association: {
                Row: {
                    account_id: number
                    created_at: string
                    role: Database["public"]["Enums"]["accounts_users_roles"]
                    updated_at: string | null
                    user_email: string
                }
                Insert: {
                    account_id: number
                    created_at?: string
                    role?: Database["public"]["Enums"]["accounts_users_roles"]
                    updated_at?: string | null
                    user_email: string
                }
                Update: {
                    account_id?: number
                    created_at?: string
                    role?: Database["public"]["Enums"]["accounts_users_roles"]
                    updated_at?: string | null
                    user_email?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "public_accounts_users_association_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "accounts"
                        referencedColumns: ["id"]
                    },
                ]
            }
            auctions: {
                Row: {
                    created_at: string
                    duration: number
                    id: number
                    increment: number
                    listing_id: string
                    start_price: number
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string
                    duration: number
                    id?: number
                    increment: number
                    listing_id: string
                    start_price: number
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string
                    duration?: number
                    id?: number
                    increment?: number
                    listing_id?: string
                    start_price?: number
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "public_auctions_listing_id_fkey"
                        columns: ["listing_id"]
                        isOneToOne: false
                        referencedRelation: "listings"
                        referencedColumns: ["id"]
                    },
                ]
            }
            contracts: {
                Row: {
                    byte_code: string
                    created_at: string
                    id: number
                    name: string | null
                }
                Insert: {
                    byte_code: string
                    created_at?: string
                    id?: number
                    name?: string | null
                }
                Update: {
                    byte_code?: string
                    created_at?: string
                    id?: number
                    name?: string | null
                }
                Relationships: []
            }
            contracts_tags: {
                Row: {
                    contract_id: number | null
                    created_at: string
                    tag: string
                }
                Insert: {
                    contract_id?: number | null
                    created_at?: string
                    tag: string
                }
                Update: {
                    contract_id?: number | null
                    created_at?: string
                    tag?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "contracts_tags_contract_id_fkey"
                        columns: ["contract_id"]
                        isOneToOne: false
                        referencedRelation: "contracts"
                        referencedColumns: ["id"]
                    },
                ]
            }
            currencies: {
                Row: {
                    chain: Database["public"]["Enums"]["chains"]
                    created_at: string
                    decimals: number | null
                    icon: string | null
                    id: string
                    name: string
                    ticker: string
                    type: Database["public"]["Enums"]["currency_type"]
                    updated_at: string | null
                    visible: boolean
                }
                Insert: {
                    chain: Database["public"]["Enums"]["chains"]
                    created_at?: string
                    decimals?: number | null
                    icon?: string | null
                    id: string
                    name: string
                    ticker: string
                    type: Database["public"]["Enums"]["currency_type"]
                    updated_at?: string | null
                    visible?: boolean
                }
                Update: {
                    chain?: Database["public"]["Enums"]["chains"]
                    created_at?: string
                    decimals?: number | null
                    icon?: string | null
                    id?: string
                    name?: string
                    ticker?: string
                    type?: Database["public"]["Enums"]["currency_type"]
                    updated_at?: string | null
                    visible?: boolean
                }
                Relationships: []
            }
            dutch_auctions: {
                Row: {
                    created_at: string
                    duration: number
                    id: number
                    listing_id: string
                    max_price: number | null
                    min_price: number
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string
                    duration: number
                    id?: number
                    listing_id: string
                    max_price?: number | null
                    min_price: number
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string
                    duration?: number
                    id?: number
                    listing_id?: string
                    max_price?: number | null
                    min_price?: number
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "public_dutch_auctions_listing_id_fkey"
                        columns: ["listing_id"]
                        isOneToOne: false
                        referencedRelation: "listings"
                        referencedColumns: ["id"]
                    },
                ]
            }
            listings: {
                Row: {
                    account_id: number
                    app_id: number
                    asset_creator: string | null
                    asset_id: string
                    asset_qty: number
                    asset_thumbnail: string | null
                    asset_type: Database["public"]["Enums"]["assets_types"]
                    chain: Database["public"]["Enums"]["chains"]
                    created_at: string
                    currency: string
                    id: string
                    name: string
                    seller_address: string
                    status: Database["public"]["Enums"]["listings_statuses"]
                    tags: string | null
                    type: Database["public"]["Enums"]["listings_types"]
                    updated_at: string | null
                    transactions: unknown | null
                }
                Insert: {
                    account_id: number
                    app_id: number
                    asset_creator?: string | null
                    asset_id: string
                    asset_qty?: number
                    asset_thumbnail?: string | null
                    asset_type: Database["public"]["Enums"]["assets_types"]
                    chain: Database["public"]["Enums"]["chains"]
                    created_at?: string
                    currency: string
                    id?: string
                    name: string
                    seller_address: string
                    status: Database["public"]["Enums"]["listings_statuses"]
                    tags?: string | null
                    type: Database["public"]["Enums"]["listings_types"]
                    updated_at?: string | null
                }
                Update: {
                    account_id?: number
                    app_id?: number
                    asset_creator?: string | null
                    asset_id?: string
                    asset_qty?: number
                    asset_thumbnail?: string | null
                    asset_type?: Database["public"]["Enums"]["assets_types"]
                    chain?: Database["public"]["Enums"]["chains"]
                    created_at?: string
                    currency?: string
                    id?: string
                    name?: string
                    seller_address?: string
                    status?: Database["public"]["Enums"]["listings_statuses"]
                    tags?: string | null
                    type?: Database["public"]["Enums"]["listings_types"]
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "listings_listing_currency_chain_fkey"
                        columns: ["currency", "chain"]
                        isOneToOne: false
                        referencedRelation: "currencies"
                        referencedColumns: ["id", "chain"]
                    },
                    {
                        foreignKeyName: "public_listings_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "accounts"
                        referencedColumns: ["id"]
                    },
                ]
            }
            sales: {
                Row: {
                    created_at: string
                    id: number
                    listing_id: string
                    price: number
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string
                    id?: number
                    listing_id: string
                    price: number
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string
                    id?: number
                    listing_id?: string
                    price?: number
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "public_sales_listing_id_fkey"
                        columns: ["listing_id"]
                        isOneToOne: false
                        referencedRelation: "listings"
                        referencedColumns: ["id"]
                    },
                ]
            }
            subscription_tiers: {
                Row: {
                    allow_premium_contracts: boolean
                    allow_secondary_sales: boolean
                    created_at: string
                    duration: number | null
                    id: number
                    listing_flat_fee: number
                    name: string
                    sale_percentage_fee: number
                    secondary_listing_flat_fee: number | null
                    secondary_sale_percentage_fee: number | null
                    updated_at: string | null
                }
                Insert: {
                    allow_premium_contracts?: boolean
                    allow_secondary_sales?: boolean
                    created_at?: string
                    duration?: number | null
                    id?: number
                    listing_flat_fee: number
                    name: string
                    sale_percentage_fee: number
                    secondary_listing_flat_fee?: number | null
                    secondary_sale_percentage_fee?: number | null
                    updated_at?: string | null
                }
                Update: {
                    allow_premium_contracts?: boolean
                    allow_secondary_sales?: boolean
                    created_at?: string
                    duration?: number | null
                    id?: number
                    listing_flat_fee?: number
                    name?: string
                    sale_percentage_fee?: number
                    secondary_listing_flat_fee?: number | null
                    secondary_sale_percentage_fee?: number | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            transactions: {
                Row: {
                    amount: number | null
                    app_id: number
                    chain: Database["public"]["Enums"]["chains"]
                    created_at: string
                    currency: string | null
                    from_address: string
                    group_id: string | null
                    id: string
                    note: string | null
                    type: Database["public"]["Enums"]["transaction_type"]
                    listings: unknown | null
                }
                Insert: {
                    amount?: number | null
                    app_id: number
                    chain: Database["public"]["Enums"]["chains"]
                    created_at?: string
                    currency?: string | null
                    from_address: string
                    group_id?: string | null
                    id: string
                    note?: string | null
                    type: Database["public"]["Enums"]["transaction_type"]
                }
                Update: {
                    amount?: number | null
                    app_id?: number
                    chain?: Database["public"]["Enums"]["chains"]
                    created_at?: string
                    currency?: string | null
                    from_address?: string
                    group_id?: string | null
                    id?: string
                    note?: string | null
                    type?: Database["public"]["Enums"]["transaction_type"]
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_administrated_accounts_for_user: {
                Args: {
                    user_email: string
                }
                Returns: number[]
            }
            get_key_account_id: {
                Args: {
                    key: string
                    origin: string
                }
                Returns: number
            }
            get_listing_by_id: {
                Args: {
                    listing_id: string
                }
                Returns: Database["public"]["CompositeTypes"]["composite_listing"]
            }
            get_member_accounts_for_user: {
                Args: {
                    user_email: string
                }
                Returns: number[]
            }
            listings: {
                Args: {
                    "": unknown
                }
                Returns: {
                    account_id: number
                    app_id: number
                    asset_creator: string | null
                    asset_id: string
                    asset_qty: number
                    asset_thumbnail: string | null
                    asset_type: Database["public"]["Enums"]["assets_types"]
                    chain: Database["public"]["Enums"]["chains"]
                    created_at: string
                    currency: string
                    id: string
                    name: string
                    seller_address: string
                    status: Database["public"]["Enums"]["listings_statuses"]
                    tags: string | null
                    type: Database["public"]["Enums"]["listings_types"]
                    updated_at: string | null
                }[]
            }
            transactions: {
                Args: {
                    "": unknown
                }
                Returns: {
                    amount: number | null
                    app_id: number
                    chain: Database["public"]["Enums"]["chains"]
                    created_at: string
                    currency: string | null
                    from_address: string
                    group_id: string | null
                    id: string
                    note: string | null
                    type: Database["public"]["Enums"]["transaction_type"]
                }[]
            }
        }
        Enums: {
            accounts_users_roles: "admin" | "moderator" | "member"
            assets_types: "arc72" | "offchain" | "asa"
            chains: "voi:testnet" | "voi:mainnet" | "algo:testnet" | "algo:mainnet"
            currency_type: "algo" | "asa" | "voi" | "arc200"
            listings_statuses: "pending" | "active" | "closed" | "cancelled"
            listings_types: "sale" | "auction" | "dutch"
            transaction_type:
                | "create"
                | "fund"
                | "buy"
                | "bid"
                | "close"
                | "update"
                | "cancel"
        }
        CompositeTypes: {
            composite_listing: {
                id: string | null
                created_at: string | null
                updated_at: string | null
                status: Database["public"]["Enums"]["listings_statuses"] | null
                chain: Database["public"]["Enums"]["chains"] | null
                seller_address: string | null
                name: string | null
                type: Database["public"]["Enums"]["listings_types"] | null
                app_id: number | null
                currency: string | null
                currency_name: string | null
                currency_ticker: string | null
                currency_icon: string | null
                currency_type: Database["public"]["Enums"]["currency_type"] | null
                currency_decimals: number | null
                asset_id: string | null
                asset_thumbnail: string | null
                asset_type: Database["public"]["Enums"]["assets_types"] | null
                asset_qty: number | null
                asset_creator: string | null
                tags: string | null
                sale_price: number | null
                auction_start_price: number | null
                auction_increment: number | null
                auction_duration: number | null
                dutch_min_price: number | null
                dutch_max_price: number | null
                dutch_duration: number | null
            }
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
            Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
            PublicSchema["Views"])
        ? (PublicSchema["Tables"] &
            PublicSchema["Views"])[PublicTableNameOrOptions] extends {
                Row: infer R
            }
            ? R
            : never
        : never

export type TablesInsert<
    PublicTableNameOrOptions extends | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Insert: infer I
        }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
                Insert: infer I
            }
            ? I
            : never
        : never

export type TablesUpdate<
    PublicTableNameOrOptions extends | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Update: infer U
        }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
                Update: infer U
            }
            ? U
            : never
        : never

export type Enums<
    PublicEnumNameOrOptions extends | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
        ? PublicSchema["Enums"][PublicEnumNameOrOptions]
        : never
