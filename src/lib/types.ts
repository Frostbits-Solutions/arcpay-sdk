export interface AssetMetadata {
  id: string
  name: string
  description: string
  thumbnail: string
  type: 'ARC72' | 'ASA' | 'OFFCHAIN'
  thumbnailMIMEType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'
  properties: { [key:string]: string }
}