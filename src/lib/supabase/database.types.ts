export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    operationName?: string
                    query?: string
                    variables?: Json
                    extensions?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
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
            accounts_currencies: {
                Row: {
                    account_id: number
                    chain: Database["public"]["Enums"]["chains"]
                    created_at: string
                    currency: string
                }
                Insert: {
                    account_id: number
                    chain: Database["public"]["Enums"]["chains"]
                    created_at?: string
                    currency: string
                }
                Update: {
                    account_id?: number
                    chain?: Database["public"]["Enums"]["chains"]
                    created_at?: string
                    currency?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "accounts_currencies_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "accounts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "accounts_currencies_chain_currency_fkey"
                        columns: ["chain", "currency"]
                        isOneToOne: false
                        referencedRelation: "currencies"
                        referencedColumns: ["chain", "id"]
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
                    created_at: string
                    tag: string
                }
                Insert: {
                    created_at?: string
                    tag: string
                }
                Update: {
                    created_at?: string
                    tag?: string
                }
                Relationships: []
            }
            contracts_tags_association: {
                Row: {
                    chain: Database["public"]["Enums"]["chains"]
                    contract: number
                    created_at: string
                    tag: string
                    version: string
                }
                Insert: {
                    chain: Database["public"]["Enums"]["chains"]
                    contract: number
                    created_at?: string
                    tag: string
                    version: string
                }
                Update: {
                    chain?: Database["public"]["Enums"]["chains"]
                    contract?: number
                    created_at?: string
                    tag?: string
                    version?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "contracts_tags_association_contract_fkey"
                        columns: ["contract"]
                        isOneToOne: false
                        referencedRelation: "contracts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contracts_tags_association_tag_fkey"
                        columns: ["tag"]
                        isOneToOne: false
                        referencedRelation: "contracts_tags"
                        referencedColumns: ["tag"]
                    },
                ]
            }
            currencies: {
                Row: {
                    chain: Database["public"]["Enums"]["chains"]
                    created_at: string
                    decimals: number
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
                    decimals: number
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
                    decimals?: number
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
            sdk_versions: {
                Row: {
                    changelog: string | null
                    created_at: string
                    id: string
                }
                Insert: {
                    changelog?: string | null
                    created_at?: string
                    id: string
                }
                Update: {
                    changelog?: string | null
                    created_at?: string
                    id?: string
                }
                Relationships: []
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
    storage: {
        Tables: {
            buckets: {
                Row: {
                    allowed_mime_types: string[] | null
                    avif_autodetection: boolean | null
                    created_at: string | null
                    file_size_limit: number | null
                    id: string
                    name: string
                    owner: string | null
                    owner_id: string | null
                    public: boolean | null
                    updated_at: string | null
                }
                Insert: {
                    allowed_mime_types?: string[] | null
                    avif_autodetection?: boolean | null
                    created_at?: string | null
                    file_size_limit?: number | null
                    id: string
                    name: string
                    owner?: string | null
                    owner_id?: string | null
                    public?: boolean | null
                    updated_at?: string | null
                }
                Update: {
                    allowed_mime_types?: string[] | null
                    avif_autodetection?: boolean | null
                    created_at?: string | null
                    file_size_limit?: number | null
                    id?: string
                    name?: string
                    owner?: string | null
                    owner_id?: string | null
                    public?: boolean | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            migrations: {
                Row: {
                    executed_at: string | null
                    hash: string
                    id: number
                    name: string
                }
                Insert: {
                    executed_at?: string | null
                    hash: string
                    id: number
                    name: string
                }
                Update: {
                    executed_at?: string | null
                    hash?: string
                    id?: number
                    name?: string
                }
                Relationships: []
            }
            objects: {
                Row: {
                    bucket_id: string | null
                    created_at: string | null
                    id: string
                    last_accessed_at: string | null
                    metadata: Json | null
                    name: string | null
                    owner: string | null
                    owner_id: string | null
                    path_tokens: string[] | null
                    updated_at: string | null
                    user_metadata: Json | null
                    version: string | null
                }
                Insert: {
                    bucket_id?: string | null
                    created_at?: string | null
                    id?: string
                    last_accessed_at?: string | null
                    metadata?: Json | null
                    name?: string | null
                    owner?: string | null
                    owner_id?: string | null
                    path_tokens?: string[] | null
                    updated_at?: string | null
                    user_metadata?: Json | null
                    version?: string | null
                }
                Update: {
                    bucket_id?: string | null
                    created_at?: string | null
                    id?: string
                    last_accessed_at?: string | null
                    metadata?: Json | null
                    name?: string | null
                    owner?: string | null
                    owner_id?: string | null
                    path_tokens?: string[] | null
                    updated_at?: string | null
                    user_metadata?: Json | null
                    version?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "objects_bucketId_fkey"
                        columns: ["bucket_id"]
                        isOneToOne: false
                        referencedRelation: "buckets"
                        referencedColumns: ["id"]
                    },
                ]
            }
            s3_multipart_uploads: {
                Row: {
                    bucket_id: string
                    created_at: string
                    id: string
                    in_progress_size: number
                    key: string
                    owner_id: string | null
                    upload_signature: string
                    user_metadata: Json | null
                    version: string
                }
                Insert: {
                    bucket_id: string
                    created_at?: string
                    id: string
                    in_progress_size?: number
                    key: string
                    owner_id?: string | null
                    upload_signature: string
                    user_metadata?: Json | null
                    version: string
                }
                Update: {
                    bucket_id?: string
                    created_at?: string
                    id?: string
                    in_progress_size?: number
                    key?: string
                    owner_id?: string | null
                    upload_signature?: string
                    user_metadata?: Json | null
                    version?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
                        columns: ["bucket_id"]
                        isOneToOne: false
                        referencedRelation: "buckets"
                        referencedColumns: ["id"]
                    },
                ]
            }
            s3_multipart_uploads_parts: {
                Row: {
                    bucket_id: string
                    created_at: string
                    etag: string
                    id: string
                    key: string
                    owner_id: string | null
                    part_number: number
                    size: number
                    upload_id: string
                    version: string
                }
                Insert: {
                    bucket_id: string
                    created_at?: string
                    etag: string
                    id?: string
                    key: string
                    owner_id?: string | null
                    part_number: number
                    size?: number
                    upload_id: string
                    version: string
                }
                Update: {
                    bucket_id?: string
                    created_at?: string
                    etag?: string
                    id?: string
                    key?: string
                    owner_id?: string | null
                    part_number?: number
                    size?: number
                    upload_id?: string
                    version?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
                        columns: ["bucket_id"]
                        isOneToOne: false
                        referencedRelation: "buckets"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
                        columns: ["upload_id"]
                        isOneToOne: false
                        referencedRelation: "s3_multipart_uploads"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            can_insert_object: {
                Args: {
                    bucketid: string
                    name: string
                    owner: string
                    metadata: Json
                }
                Returns: undefined
            }
            extension: {
                Args: {
                    name: string
                }
                Returns: string
            }
            filename: {
                Args: {
                    name: string
                }
                Returns: string
            }
            foldername: {
                Args: {
                    name: string
                }
                Returns: string[]
            }
            get_size_by_bucket: {
                Args: Record<PropertyKey, never>
                Returns: {
                    size: number
                    bucket_id: string
                }[]
            }
            list_multipart_uploads_with_delimiter: {
                Args: {
                    bucket_id: string
                    prefix_param: string
                    delimiter_param: string
                    max_keys?: number
                    next_key_token?: string
                    next_upload_token?: string
                }
                Returns: {
                    key: string
                    id: string
                    created_at: string
                }[]
            }
            list_objects_with_delimiter: {
                Args: {
                    bucket_id: string
                    prefix_param: string
                    delimiter_param: string
                    max_keys?: number
                    start_after?: string
                    next_token?: string
                }
                Returns: {
                    name: string
                    id: string
                    metadata: Json
                    updated_at: string
                }[]
            }
            operation: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
            search: {
                Args: {
                    prefix: string
                    bucketname: string
                    limits?: number
                    levels?: number
                    offsets?: number
                    search?: string
                    sortcolumn?: string
                    sortorder?: string
                }
                Returns: {
                    name: string
                    id: string
                    updated_at: string
                    created_at: string
                    last_accessed_at: string
                    metadata: Json
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
            | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
    PublicTableNameOrOptions extends
            | keyof PublicSchema["Tables"]
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
    PublicTableNameOrOptions extends
            | keyof PublicSchema["Tables"]
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
    PublicEnumNameOrOptions extends
            | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
        ? PublicSchema["Enums"][PublicEnumNameOrOptions]
        : never
