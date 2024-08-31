export interface AssetMetadata {
  id: string
  name: string
  description: string
  thumbnail: string
  type: 'arc72' | 'asa' | 'offchain'
  thumbnailMIMEType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'
  properties: { [key:string]: string }
}