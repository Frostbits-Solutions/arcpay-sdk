export interface AssetMetadata {
    id: string
    name: string,
    amount?: number,
    decimals: number,
    description: string
    thumbnail: string
    type: 'arc72' | 'asa' | 'offchain'
    subtype: 'arc3' | 'arc19' | undefined
    thumbnailMIMEType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'
    properties: { [key: string]: string }
}

export interface Asset {
    amount: number
    "asset-id": number
    "is-frozen": false
}