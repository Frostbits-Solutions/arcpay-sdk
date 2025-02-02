import axios from 'axios'
import type {PublicNetwork} from '@/lib/algod/networks.config'
import type { AssetMetadata } from '@/lib/types'
import algosdk from "algosdk";


async function getAddressAssets(algodClient: algosdk.Algodv2, address: string, network: PublicNetwork, page: number = 0, size: number = 25): Promise<AssetMetadata[]> {
    let url
    if (network === 'voi:testnet') url = `https://arc72-idx.nftnavigator.xyz/nft-indexer/v1/tokens`
    if (network === 'voi:mainnet') url = `https://arc72-voi-mainnet.nftnavigator.xyz/nft-indexer/v1/tokens`
    if (!url) throw new Error('Invalid network')

    const response = await axios.get(url, { params: { owner: address } });
    if (!response.data) throw new Error(`Failed to fetch assets metadata for address ${address}`)
    const assets = response.data.tokens
    const paginatedAssets = assets.slice(page * size, (page + 1) * size)
    return paginatedAssets.map((asset: any) => {
        const metadata = JSON.parse(asset.metadata)
        return {
            id: `${asset.contractId}/${asset.tokenId}`,
            name: metadata.name,
            description: metadata.description,
            type: 'arc72',
            thumbnail: metadata.image,
            thumbnailMIMEType: metadata.image_mimetype,
            properties: metadata.properties
        }
    })
}

async function getCreatedAppId(algodClient: algosdk.Algodv2, txId: string, network: PublicNetwork): Promise<number> {
    let url: string | undefined
    if (network === 'voi:testnet') url = `https://testnet-idx.voi.nodely.dev/v2/transactions/${txId}`
    if (network === 'voi:mainnet') url = `https://mainnet-idx.voi.nodely.dev/v2/transactions/${txId}`
    if (!url) throw new Error('Invalid network')

    await algosdk.waitForConfirmation(
        algodClient,
        txId,
        12)

    const getTxExponentialBackOff = (tryNumber: number = 0): Promise<number> => {
        if (tryNumber > 10) {
            throw new Error(`Failed to fetch application index for txID ${txId}`)
        }
        return new Promise<number>((resolve, reject) => {
            setTimeout(() => {
                axios.get<{ transaction: { 'created-application-index'?: number } }>(url as string)
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
                        } else {
                            reject(error)
                        }
                    })
            }, tryNumber * 500)
        })
    }
    return await getTxExponentialBackOff()
}

function getExplorerLink(assetId: string, network: PublicNetwork) {
    const params = assetId.split('/')
    if (params[1]) {
        if (network === 'voi:mainnet') return `https://nftnavigator.xyz/collection/${params[0]}/token/${params[1]}`
        else return `https://nftnavigator.xyz/collection/${params[0]}/token/${params[1]}`
    } else return '#'
}

export default {
    getAddressAssets,
    getCreatedAppId,
    getExplorerLink
}
