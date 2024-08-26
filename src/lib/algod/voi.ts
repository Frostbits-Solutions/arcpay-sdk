import axios from 'axios'
import type { PublicNetwork } from '@/lib/algod/networks.config'
import type { AssetMetadata } from '@/lib/types'
import algosdk from "algosdk";

export async function getAssetMetadata(assetId: string, network: PublicNetwork): Promise<AssetMetadata> {
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
    type: 'ARC72',
    description: metadata.description,
    thumbnail: metadata.image,
    thumbnailMIMEType: metadata.image_mimetype,
    properties: metadata.properties
  }
}

export async function getAddressAssets(address: string, network: PublicNetwork): Promise<AssetMetadata[]> {
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
      type: 'ARC72',
      thumbnail: metadata.image,
      thumbnailMIMEType: metadata.image_mimetype,
      properties: metadata.properties
    }
  })
}

export async function getCreatedAppId(algodClient: algosdk.Algodv2, txId: string, network: PublicNetwork): Promise<number> {
  let url: string | undefined
  if (network === 'voi:testnet') url = `https://testnet-idx.voi.nodly.io:443/v2/transactions/${txId}`
  if (network === 'voi:mainnet') url = `https://testnet-idx.voi.nodly.io:443/v2/transactions/${txId}`
  if (!url) throw new Error('Invalid network')

  await algosdk.waitForConfirmation(
      algodClient,
      txId,
      12)

  const getTxExponentialBackOff = (tryNumber: number = 0): Promise<number> => {
    if (tryNumber > 5) {
      throw new Error(`Failed to fetch application index for txID ${txId}`)
    }
    return new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        axios.get<{transaction: {'created-application-index'?: number}}>(url as string)
          .then((response) => {
            if (response.data.transaction['created-application-index']) {
              resolve(response.data.transaction['created-application-index'])
            } else {
              reject('Failed to fetch application index ')
            }
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              resolve(getTxExponentialBackOff(tryNumber + 1))
            }
            else {
              reject(error)
            }
          })
      }, tryNumber * 300)
    })
  }
  return await getTxExponentialBackOff()
}
