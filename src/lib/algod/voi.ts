import axios from 'axios'
import type { PublicNetwork } from '@/lib/algod/networks.config'
import type { OnChainAssetMetadata } from '@/lib/types'
import algosdk from "algosdk";

export async function getAssetMetadata(assetId: string, network: PublicNetwork): Promise<OnChainAssetMetadata> {
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

export async function getAddressAssets(address: string, network: PublicNetwork): Promise<OnChainAssetMetadata[]> {
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

export async function getCreatedAppId(algodClient: algosdk.Algodv2, txId: string, network: PublicNetwork): Promise<number> {
  let url
  if (network === 'voi:testnet') url = `https://testnet-idx.voi.nodly.io:443/v2/transactions/${txId}`
  if (network === 'voi:mainnet') url = `https://testnet-idx.voi.nodly.io:443/v2/transactions/${txId}`
  if (!url) throw new Error('Invalid network')
  console.log(url)

  await algosdk.waitForConfirmation(
      algodClient,
      txId,
      12)

  let data = undefined
  for (let i = 0; i < 10; i++) {
    try {
      const response = await axios.get(url);
      if (!response.data) throw new Error(`Failed to fetch application index for txID ${txId}`)
      data = response.data
    } catch (e) {
      console.log(`attempt ${i} to fetch appID failed`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    if (data !== undefined) {
      break
    }
  }


  return data.transaction['created-application-index']
}
