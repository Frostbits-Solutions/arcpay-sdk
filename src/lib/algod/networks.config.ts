import { NetworkId, type SupportedWallet, WalletId } from '@txnlab/use-wallet'
import { getAddressAssets, getAssetMetadata } from '@/lib/algod/voi'
import type { OnChainAssetMetadata } from '@/lib/types'

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
    getAssetMetadata: (assetId: string) => Promise<OnChainAssetMetadata>
    getAddressAssets: (address: string) => Promise<OnChainAssetMetadata[]>
  }
  nodeToken: string
  nodePort: number
}

export const networksConfig:{[key in PublicNetwork]: NetworksConfig} = {
  'voi:testnet': {
    key: 'voi:testnet',
    chain: 'voi',
    networkId: NetworkId.TESTNET,
    blockchainId: 'algorand:IXnoWtviVVJW5LGivNFc0Dq14V3kqaXu',
    nodeBaseURL: 'https://voitest-api.algorpc.pro/',
    walletProviders: [
        {
          id: WalletId.WALLETCONNECT,
          options: { projectId: import.meta.env.VITE_WC_PROJECT_ID}
        },
        WalletId.KIBISIS],
    services: {
      getAssetMetadata: (assetId: string) => getAssetMetadata(assetId, 'voi:testnet'),
      getAddressAssets: (address: string) => getAddressAssets(address, 'voi:testnet')
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
        options: { projectId: import.meta.env.VITE_WC_PROJECT_ID}
      },
      WalletId.KIBISIS],
    services: {
      getAssetMetadata: (assetId: string) => getAssetMetadata(assetId, 'voi:mainnet'),
      getAddressAssets: (address: string) => getAddressAssets(address, 'voi:mainnet')
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
        options: { projectId: import.meta.env.VITE_WC_PROJECT_ID}
      },
      WalletId.KIBISIS],
    services: {
      getAssetMetadata: (assetId: string) => getAssetMetadata(assetId, 'voi:testnet'),
      getAddressAssets: (address: string) => getAddressAssets(address, 'voi:testnet')
    },
    nodeToken: '',
    nodePort: 443
  },
  'algo:mainnet': {
    key: 'algo:mainnet',
    chain: 'algo',
    networkId: NetworkId.MAINNET,
    blockchainId: 'algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k',
    nodeBaseURL: 'https://mainnet-api.algonode.cloud',
    walletProviders: [
      WalletId.DEFLY,
      WalletId.PERA,
      WalletId.EXODUS,
      {
        id: WalletId.WALLETCONNECT,
        options: { projectId: import.meta.env.VITE_WC_PROJECT_ID}
      },
      WalletId.KIBISIS],
    services: {
      getAssetMetadata: (assetId: string) => getAssetMetadata(assetId, 'voi:mainnet'),
      getAddressAssets: (address: string) => getAddressAssets(address, 'voi:mainnet')
    },
    nodeToken: '',
    nodePort: 443
  }
}
