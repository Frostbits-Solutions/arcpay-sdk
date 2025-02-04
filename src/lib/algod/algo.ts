import axios from 'axios'
import type {PublicNetwork} from '@/lib/algod/networks.config'
import type { Asset, AssetMetadata } from '@/lib/types'
import algosdk from "algosdk";
import { CID, type Version } from 'multiformats/cid'
import {create as createDigest} from 'multiformats/hashes/digest'
import * as dagPB from '@ipld/dag-pb'

async function getAddressAssets(algodClient: algosdk.Algodv2, address: string, page: number = 0, size: number = 25): Promise<AssetMetadata[]> {
    const ipfsGateway = 'https://ipfs.algonode.xyz/ipfs/'
    const account = await algodClient.accountInformation(address).do()
    const assets = account.assets.filter((asset: Asset) => asset.amount > 0)
    const paginatedAssets = assets.slice(page * size, (page + 1) * size)

    const promises = paginatedAssets.map(async (asset: Asset) => {
        let subtype
        let thumbnailUrl = ''
        const info = await algodClient.getAssetByID(asset['asset-id']).do()

        const arc19Regex = /template-ipfs:\/\/{ipfscid:(\d):([a-z0-9-]+):reserve:([a-z0-9-]+)}/;
        const arc19Match = info.params.url?.match(arc19Regex);

        if(arc19Match) {
            const reserveAddress = info.params.reserve
            const version = parseInt(arc19Match[1]);
            const codecName = arc19Match[2];
            const hashName = arc19Match[3];

            if (codecName !== 'dag-pb') throw new Error(`Invalid codec for CID v0: ${codecName}. Expected: dag-pb`)
            if (hashName !== 'sha2-256') throw new Error(`Invalid hash type for CID v0: ${hashName}. Expected: sha2-256`)
            if (version < 0 || version > 1) throw new Error(`Unsupported CID version: ${version}`)

            const reserveBytes = algosdk.decodeAddress(reserveAddress).publicKey;
            const digest = createDigest(18, reserveBytes)
            const cid = CID.create(version as Version, dagPB.code, digest)

            const metadata = await axios.get(`${ipfsGateway}${cid.toString()}`)
            if (metadata.data?.image) thumbnailUrl = metadata.data.image
            subtype = 'arc19'

        } else if (info.params.url?.includes('#arc3')) {
            const metadataUrl = info.params.url.replace('ipfs://', ipfsGateway)
            const metadata = await axios.get(metadataUrl)
            thumbnailUrl = metadata.data?.image
            subtype = 'arc3'
        } else if (info.params.url?.includes('ipfs://')) {
            thumbnailUrl = info.params.url
            subtype = 'arc69'
        } else {
            try {
                const response = await axios.get(`https://asa-list.tinyman.org/assets/${info.index}/icon.png`)
                if (response.data.includes('<!DOCTYPE html>')) throw new Error('Invalid image')
                thumbnailUrl = `https://asa-list.tinyman.org/assets/${info.index}/icon.png`
                subtype = 'token'
            } catch (e) {
                console.error(`Unable to load thumbnail for asset ${info.index}`)
                thumbnailUrl = info.params.url
            }
        }

        thumbnailUrl = thumbnailUrl.replace('ipfs://', ipfsGateway)

        return {
            type: 'asa',
            subtype,
            amount: asset.amount,
            decimals: info.params.decimals,
            id: `${info.index}`,
            name: info.params.name,
            description: info.params.name,
            thumbnail: thumbnailUrl,
            thumbnailMIMEType: 'image/png',
            properties: {}
        }
    })

    return Promise.allSettled(promises).then((results) => results.map((result) => {
        if (result.status === 'fulfilled') {
            return result.value
        }
    }).filter(asset => asset))
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

function getExplorerLink(assetId: string, network: PublicNetwork) {
    if (network === 'algo:mainnet') return `https://explorer.perawallet.app/asset/${assetId}/`
    else return `https://testnet.explorer.perawallet.app/asset/${assetId}/`
}

export default {
    getAddressAssets,
    getCreatedAppId,
    getExplorerLink
}
