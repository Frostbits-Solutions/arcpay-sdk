import axios from 'axios'
import type {PublicNetwork} from '@/lib/algod/networks.config'
import type {AssetMetadata} from '@/lib/types'
import algosdk from "algosdk";

interface Asset {
    amount: number
    "asset-id": number
    "is-frozen": false
}

async function getAssetMetadata(assetId: string, network: PublicNetwork): Promise<AssetMetadata> {
    let url
    if (network === 'algo:testnet') url = `https://arc72-idx.nftnavigator.xyz/nft-indexer/v1/tokens`
    if (network === 'algo:mainnet') url = `https://arc72-idx.nftnavigator.xyz/nft-indexer/v1/tokens`
    if (!url) throw new Error('Invalid network')

    const [contractId, tokenId] = assetId.split('/')
    const response = await axios.get(url, {params: {contractId, tokenId}});
    if (!response.data) throw new Error(`Failed to fetch asset metadata for ${assetId}`)

    const metadata = JSON.parse(response.data.tokens[0].metadata)

    return {
        type: 'asa',
        id: assetId,
        name: metadata.name,
        description: metadata.description,
        thumbnail: metadata.image,
        thumbnailMIMEType: metadata.image_mimetype,
        properties: metadata.properties
    }
}

async function getAddressAssets(algodClient: algosdk.Algodv2, address: string, page: number = 0, size: number = 25): Promise<AssetMetadata[]> {
    const account = await algodClient.accountInformation(address).do()
    const assets = account.assets.filter((asset: Asset) => asset.amount > 0)
    const paginatedAssets = assets.slice(page * size, (page + 1) * size)

    const promises = paginatedAssets.map(async (asset: Asset) => {
        let thumbnailUrl = ''
        const info = await algodClient.getAssetByID(asset['asset-id']).do()
        console.log(info)
        if (info.params.url?.includes('#arc3')) {
            const metadata = await axios.get(info.params.url?.replace('ipfs://', 'https://ipfs.algonode.xyz/ipfs/'))
            thumbnailUrl = metadata.data?.image
        } else {
            thumbnailUrl = info.params.url
        }

        if (thumbnailUrl) {
            thumbnailUrl = thumbnailUrl.replace('ipfs://', 'https://ipfs.algonode.xyz/ipfs/')
        } else {
            console.error(`Unable to load thumbnail for asset ${info.index}`)
        }

        return {
            type: 'asa',
            id: asset['asset-id'].toString(),
            name: info.params.name,
            description: info.params.name,
            thumbnail: thumbnailUrl,
            thumbnailMIMEType: 'image/png',
            properties: {}
        }
    })

    return Promise.all(promises)
}

async function getCreatedAppId(algodClient: algosdk.Algodv2, txId: string, network: PublicNetwork): Promise<number> {
    let url: string | undefined
    if (network === 'algo:testnet') url = `https://testnet-idx.algonode.cloud:443/v2/transactions/${txId}`
    if (network === 'algo:mainnet') url = `https://mainnet-idx.algonode.cloud:443/v2/transactions/${txId}`
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
            }, tryNumber * 300)
        })
    }
    return await getTxExponentialBackOff()
}

export default {
    getAssetMetadata,
    getAddressAssets,
    getCreatedAppId
}
