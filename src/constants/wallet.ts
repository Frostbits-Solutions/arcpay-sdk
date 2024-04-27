import { ICON as iconKibisis } from '../wallets/kibisis/constants'
import { ICON as iconWalletconnect } from '../wallets/walletConnect/constants'
import Kibisis from '@/wallets/kibisis'
import WalletConnect from '@/wallets/walletConnect'

export const PROVIDER = {
  'kibisis': Kibisis,
  'walletconnect': WalletConnect
}

export enum PROVIDER_ID {
  KIBISIS = 'kibisis',
  WALLETCONNECT = 'walletconnect',
}

export const PROVIDER_ICONS: {[key: string]: string} = {
  kibisis: iconKibisis,
  walletconnect: iconWalletconnect,
}

export const ARC_PAY_METADA = {
  name: 'ARC pay',
  description: '',
  url: '#',
  icons: ['https://walletconnect.com/walletconnect-logo.png']
}
