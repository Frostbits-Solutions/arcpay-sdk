import { WalletConnect, Kibisis } from '@/lib/wallets'
import { getAddressAssets, getAssetMetadata } from '@/lib/algod/voi'

export type PublicNetwork = keyof typeof networkConfig
export const networkConfig = {
  'voi:testnet': {
    network: 'voi:testnet',
    blockchainId: 'algorand:IXnoWtviVVJW5LGivNFc0Dq14V3kqaXu',
    nodeBaseURL: 'https://testnet-api.voi.nodly.io/',
    walletProviders: [WalletConnect, Kibisis],
    services: {
      getAssetMetadata: (assetId: string) => getAssetMetadata(assetId, 'voi:testnet'),
      getAddressAssets: (address: string) => getAddressAssets(address, 'voi:testnet')
    },
    nodeToken: '',
    nodePort: 443
  },
  'voi:mainnet': {
    network: 'voi:mainnet',
    blockchainId: 'algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k',
    nodeBaseURL: 'https://testnet-api.voi.nodly.io/',
    walletProviders: [WalletConnect, Kibisis],
    services: {
      getAssetMetadata: (assetId: string) => getAssetMetadata(assetId, 'voi:mainnet'),
      getAddressAssets: (address: string) => getAddressAssets(address, 'voi:mainnet')
    },
    nodeToken: '',
    nodePort: 443
  }
}