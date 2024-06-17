import { Transaction } from '@/lib//transaction/Transaction'
import { AlgodClient } from '@/lib/algod/AlgodClient'
import { longToByteArray } from '@/utils'
import type Wallet from '@/lib/wallets/Wallet'
import { arc72Schema } from '@/lib/contracts/abi/arc72'
import type { ABI } from '@/lib/contracts/abi/types'

export const interfaces = {
  voi: {
    voi: {
      arc72: {
        sale: {
          create: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            nftAppID: number,
            nftID: number,
            price: number,
            approvalProgram: string,
            clearProgram: string) =>
            new Transaction(algod, { fromAddress, nftAppID, nftID })
              .createApp([longToByteArray(price * 1_000_000, 8)], approvalProgram, clearProgram)
              .fund()
              .approve(arc72Schema as ABI, 'arc72_approve')
              .call('fund')
              .send(wallet),
          buy: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            nftAppID: number,
            nftID: number,
            appIndex: number,
            sellerAddress: string,
            feesAddress: string,
            price: number
          ) => new Transaction(algod, { fromAddress, nftAppID, nftID, appIndex })
            .preValidate(sellerAddress, feesAddress)
            .pay(price)
            .call('buy')
            .send(wallet)
        },
        auction: {
          create: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            nftAppID: number,
            nftID: number,
            startPrice: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string) =>
            new Transaction(algod, { fromAddress, nftAppID, nftID })
              .createApp([
                longToByteArray(startPrice * 1_000_000, 8),
                longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8)
              ], approvalProgram, clearProgram)
              .fund()
              .approve(arc72Schema as ABI, 'arc72_approve')
              .call('fund')
              .send(wallet),
          bid: () => { return }
        },
        dutch : {
          create: () => { return },
          buy: () => { return }
        }
      },
      rwa: {
        sale: {
          create: () => { return },
          buy: () => { return }
        }
      }
    },
    arc200: {
      arc72: {
        sale: {
          create: () => { return },
          buy: () => { return }
        },
        auction: {
          create: () => { return },
          bid: () => { return }
        },
        dutch : {
          create: () => { return },
          buy: () => { return }
        }
      },
      rwa: {
        sale: {
          create: () => { return },
          buy: () => { return }
        }
      }
    }
  }
}