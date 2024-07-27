import axios from 'axios'
import type { PublicNetwork } from '@/lib/algod/network.config'
import type { onChainAssetMetadata } from '@/lib/types'

export async function getAssetMetadata(assetId: string, network: PublicNetwork): Promise<onChainAssetMetadata> {
  let url
  if (network === 'voi:testnet') url = `https://arc72-idx.nftnavigator.xyz/nft-indexer/v1/tokens`
  if (network === 'voi:mainnet') url = `https://arc72-idx.nftnavigator.xyz/nft-indexer/v1/tokens`
  if(!url) throw new Error('Invalid network')

  const [contractId, tokenId] = assetId.split('/')
  const response = await axios.get(url, {params: {contractId, tokenId}});
  if (!response.data) throw new Error(`Failed to fetch asset metadata for ${assetId}`)

  const metadata = JSON.parse(response.data.tokens[0].metadata)

  return {
    id: assetId,
    name: metadata.name,
    description: metadata.description,
    thumbnail: metadata.image,
    thumbnailMIMEType: metadata.image_mimetype,
    properties: metadata.properties
  }
}

export async function getAddressAssets(address: string, network: PublicNetwork): Promise<onChainAssetMetadata[]> {
  let url
  if (network === 'voi:testnet') url = `https://arc72-idx.nftnavigator.xyz/nft-indexer/v1/tokens`
  if (network === 'voi:mainnet') url = `https://arc72-idx.nftnavigator.xyz/nft-indexer/v1/tokens`
  if(!url) throw new Error('Invalid network')

  const response = await axios.get(url, {params: {owner: address}});
  if (!response.data) throw new Error(`Failed to fetch assets metadata for address ${address}`)

  return response.data.tokens.map((token: any) => {
    const metadata = JSON.parse(token.metadata)
    return {
      id: `${token.contractId}/${token.tokenId}`,
      name: metadata.name,
      description: metadata.description,
      thumbnail: metadata.image,
      thumbnailMIMEType: metadata.image_mimetype,
      properties: metadata.properties
    }
  })
}