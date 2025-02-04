import {NetworkId, type SupportedWallet, WalletId} from '@txnlab/use-wallet'
import voi from '@/lib/algod/voi'
import algo from '@/lib/algod/algo'
import type {AssetMetadata} from '@/lib/types'
import algosdk from "algosdk";

export type PublicNetwork = VoiPublicNetwork | AlgorandPublicNetwork
export type VoiPublicNetwork = 'voi:testnet' | 'voi:mainnet'
export type AlgorandPublicNetwork = 'algo:testnet' | 'algo:mainnet'
export type Chain = 'voi' | 'algo'

export type NetworksConfig = {
    key: PublicNetwork
    chain: Chain
    networkId: NetworkId
    nodeBaseURL: string
    walletProviders: SupportedWallet[]
    services: {
        getAddressAssets: (algodClient: algosdk.Algodv2, address: string, page?: number, size?: number) => Promise<AssetMetadata[]>
        getCreatedAppId: (algodClient: algosdk.Algodv2, txId: string) => Promise<number>
        getExplorerLink: (assetId: string) => string
    }
    nodeToken: string
    nodePort: number
}

export const networksConfig: { [key in PublicNetwork]: NetworksConfig } = {
    'voi:testnet': {
        key: 'voi:testnet',
        chain: 'voi',
        networkId: NetworkId.TESTNET,
        nodeBaseURL: 'https://voitest-api.algorpc.pro/',
        walletProviders: [
            {
                id: WalletId.WALLETCONNECT,
                options: {projectId: import.meta.env.VITE_WC_PROJECT_ID}
            },
            WalletId.KIBISIS],
        services: {
            getAddressAssets: (algodClient: algosdk.Algodv2, address: string, page?: number, size?: number) => voi.getAddressAssets(algodClient, address, 'voi:testnet', page, size),
            getCreatedAppId: (algodClient: algosdk.Algodv2, txId: string) => voi.getCreatedAppId(algodClient, txId, 'voi:testnet'),
            getExplorerLink: (assetId: string) => voi.getExplorerLink(assetId, 'voi:testnet')
        },
        nodeToken: '',
        nodePort: 443
    },
    'voi:mainnet': {
        key: 'voi:mainnet',
        chain: 'voi',
        networkId: NetworkId.VOIMAIN,
        nodeBaseURL: 'https://mainnet-api.voi.nodely.dev/',
        walletProviders: [
            {
                id: WalletId.WALLETCONNECT,
                options: {projectId: import.meta.env.VITE_WC_PROJECT_ID}
            },
            WalletId.KIBISIS],
        services: {
            getAddressAssets: (algodClient: algosdk.Algodv2, address: string, page?: number, size?: number) => voi.getAddressAssets(algodClient, address, 'voi:mainnet', page, size),
            getCreatedAppId: (algodClient: algosdk.Algodv2, txId: string) => voi.getCreatedAppId(algodClient, txId, 'voi:mainnet'),
            getExplorerLink: (assetId: string) => voi.getExplorerLink(assetId, 'voi:mainnet')
        },
        nodeToken: '',
        nodePort: 443
    },
    'algo:testnet': {
        key: 'algo:testnet',
        chain: 'algo',
        networkId: NetworkId.TESTNET,
        nodeBaseURL: 'https://testnet-api.algonode.cloud',
        walletProviders: [
            WalletId.DEFLY,
            WalletId.PERA,
            WalletId.EXODUS,
            {
                id: WalletId.WALLETCONNECT,
                options: {projectId: import.meta.env.VITE_WC_PROJECT_ID}
            },
            {
              id: WalletId.LUTE,
              options: { siteName: 'Arcpay' }
            },
            WalletId.KIBISIS],
        services: {
            getAddressAssets: (algodClient: algosdk.Algodv2, address: string, page?: number, size?: number) => algo.getAddressAssets(algodClient, address, page, size),
            getCreatedAppId: (algodClient: algosdk.Algodv2, txId: string) => algo.getCreatedAppId(algodClient, txId, 'algo:testnet'),
            getExplorerLink: (assetId: string) => algo.getExplorerLink(assetId, 'algo:testnet')
        },
        nodeToken: '',
        nodePort: 443
    },
    'algo:mainnet': {
        key: 'algo:mainnet',
        chain: 'algo',
        networkId: NetworkId.MAINNET,
        nodeBaseURL: 'https://mainnet-api.algonode.cloud',
        walletProviders: [
            WalletId.DEFLY,
            WalletId.PERA,
            WalletId.EXODUS,
            {
                id: WalletId.WALLETCONNECT,
                options: {projectId: import.meta.env.VITE_WC_PROJECT_ID}
            },
            {
              id: WalletId.LUTE,
              options: { siteName: 'Arcpay' }
            },
            WalletId.KIBISIS],
        services: {
            getAddressAssets: (algodClient: algosdk.Algodv2, address: string, page?: number, size?: number) => algo.getAddressAssets(algodClient, address, page, size),
            getCreatedAppId: (algodClient: algosdk.Algodv2, txId: string) => algo.getCreatedAppId(algodClient, txId, 'algo:mainnet'),
            getExplorerLink: (assetId: string) => algo.getExplorerLink(assetId, 'algo:mainnet')
        },
        nodeToken: '',
        nodePort: 443
    }
}
