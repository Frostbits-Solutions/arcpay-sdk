import { PROVIDER_ID } from '@/constants'

export interface Account {
  providerId: PROVIDER_ID
  address: string
  name?: string
}


export type WalletProvider = {
  id: PROVIDER_ID
  name: string
  icon: string
  isWalletConnect: boolean
}

type ExtendValues<Type> = {
  [Property in keyof Type]: Type[Property] | null
}

// This type extends the values of `WalletProvider` with `null` values
// and adds the `accounts` property.
export type Wallet = ExtendValues<WalletProvider> & {
  accounts: Account[]
}
