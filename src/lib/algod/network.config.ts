import {NetworkId, WalletId} from '@txnlab/use-wallet-vue'
import { getAddressAssets, getAssetMetadata } from '@/lib/algod/voi'

export type PublicNetwork = keyof typeof networkConfig
export const networkConfig = {
  'voi:testnet': {
    network: 'voi:testnet',
    networkId: NetworkId.TESTNET,
    blockchainId: 'algorand:IXnoWtviVVJW5LGivNFc0Dq14V3kqaXu',
    nodeBaseURL: 'https://testnet-api.voi.nodly.io/',
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
    network: 'voi:mainnet',
    networkId: NetworkId.MAINNET,
    blockchainId: 'algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k',
    nodeBaseURL: 'https://testnet-api.voi.nodly.io/',
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
    network: 'algo:testnet',
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
    network: 'algo:mainnet',
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
