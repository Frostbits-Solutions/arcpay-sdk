import type {WalletAccount} from "@txnlab/use-wallet";
import type {AppProvider} from '@/lib/app/AppProvider'
import router from '@/router'

export function selectWallet(appProvider: AppProvider) {
    return new Promise<WalletAccount>((resolve, reject) => {
        appProvider.provide('WalletSelection', {}, (account: WalletAccount, error?: Error) => {
            if (error) reject(error)
            resolve(account)
        })
        router.push({name: 'wallet-selection'})
    })
}