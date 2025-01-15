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
    blockchainId: string
    nodeBaseURL: string
    walletProviders: SupportedWallet[]
    services: {
        getAddressAssets: (algodClient: algosdk.Algodv2, address: string, page?: number, size?: number) => Promise<AssetMetadata[]>
        getCreatedAppId: (algodClient: algosdk.Algodv2, txId: string) => Promise<number>
    }
    nodeToken: string
    nodePort: number
}

export const networksConfig: { [key in PublicNetwork]: NetworksConfig } = {
    'voi:testnet': {
        key: 'voi:testnet',
        chain: 'voi',
        networkId: NetworkId.TESTNET,
        blockchainId: 'algorand:IXnoWtviVVJW5LGivNFc0Dq14V3kqaXu',
        nodeBaseURL: 'https://voitest-api.algorpc.pro/',
        walletProviders: [
            {
                id: WalletId.WALLETCONNECT,
                options: {projectId: import.meta.env.VITE_WC_PROJECT_ID}
            },
            WalletId.KIBISIS],
        services: {
            getAddressAssets: (algodClient: algosdk.Algodv2, address: string, page?: number, size?: number) => voi.getAddressAssets(address, 'voi:testnet'),
            getCreatedAppId: (algodClient: algosdk.Algodv2, txId: string) => voi.getCreatedAppId(algodClient, txId, 'voi:testnet')
        },
        nodeToken: '',
        nodePort: 443
    },
    'voi:mainnet': {
        key: 'voi:mainnet',
        chain: 'voi',
        networkId: NetworkId.MAINNET,
        blockchainId: 'algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k',
        nodeBaseURL: 'https://voitest-api.algorpc.pro/',
        walletProviders: [
            {
                id: WalletId.WALLETCONNECT,
                options: {projectId: import.meta.env.VITE_WC_PROJECT_ID}
            },
            WalletId.KIBISIS],
        services: {
            getAddressAssets: (algodClient: algosdk.Algodv2, address: string, page?: number, size?: number) => voi.getAddressAssets(address, 'voi:mainnet'),
            getCreatedAppId: (algodClient: algosdk.Algodv2, txId: string) => voi.getCreatedAppId(algodClient, txId, 'voi:mainnet')
        },
        nodeToken: '',
        nodePort: 443
    },
    'algo:testnet': {
        key: 'algo:testnet',
        chain: 'algo',
        networkId: NetworkId.TESTNET,
        blockchainId: 'algorand:IXnoWtviVVJW5LGivNFc0Dq14V3kqaXu',
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
              options: { siteName: 'ArcPay' }
            },
            WalletId.KIBISIS],
        services: {
            getAddressAssets: (algodClient: algosdk.Algodv2, address: string, page?: number, size?: number) => algo.getAddressAssets(algodClient, address, page, size),
            getCreatedAppId: (algodClient: algosdk.Algodv2, txId: string) => algo.getCreatedAppId(algodClient, txId, 'algo:testnet')
        },
        nodeToken: '',
        nodePort: 443
    },
    'algo:mainnet': {
        key: 'algo:mainnet',
        chain: 'algo',
        networkId: NetworkId.MAINNET,
        blockchainId: 'algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
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
              options: { siteName: 'ArcPay' }
            },
            WalletId.KIBISIS],
        services: {
            getAddressAssets: (algodClient: algosdk.Algodv2, address: string, page?: number, size?: number) => algo.getAddressAssets(algodClient, address, page, size),
            getCreatedAppId: (algodClient: algosdk.Algodv2, txId: string) => algo.getCreatedAppId(algodClient, txId, 'algo:mainnet')
        },
        nodeToken: '',
        nodePort: 443
    }
}
