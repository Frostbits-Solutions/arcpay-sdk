export interface onChainAssetMetadata {
  id: string
  name: string
  description: string
  thumbnail: string
  thumbnailMIMEType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'
  properties: { [key:string]: string }
}