import { Transaction } from '@/lib//transaction/Transaction'
import { AlgodClient } from '@/lib/algod/AlgodClient'
import { longToByteArray } from '@/lib/utils'
import { arc72Schema } from '@/lib/contracts/abi/arc72'
import { arc200Schema } from '@/lib/contracts/abi/arc200'
import type { ABI } from '@/lib/contracts/abi/types'
import algosdk, {type TransactionSigner} from 'algosdk'

export const interfaces = {
  voi: {
    voi: {
      arc72: {
        sale: {
          create: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            nftAppID: number,
            nftID: number,
            price: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod.client, { fromAddress })
              .createApp([
                longToByteArray(nftAppID, 8),
                longToByteArray(nftID, 32),
                longToByteArray(price * 1_000_000, 8),
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8)
              ], approvalProgram, clearProgram)
              .fund()
              .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
              .call('fund', [])
              .send(transaction),
          buy: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            nftAppID: number,
            appIndex: number,
            sellerAddress: string,
            price: number,
            feesAppAddress: string,
            feesAppId: number
          ) => new Transaction(algod.client, { fromAddress, appIndex })
            .preValidate([sellerAddress], [nftAppID])
            .pay(price)
            .call('buy', [], [feesAppAddress], [feesAppId])
            .send(transaction)
        },
        auction: {
          create: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            nftAppID: number,
            nftID: number,
            startPrice: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod.client, { fromAddress })
              .createApp([
                longToByteArray(nftAppID, 8),
                longToByteArray(nftID, 32),
                longToByteArray(startPrice * 1_000_000, 8),
                longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8)
              ], approvalProgram, clearProgram)
              .fund()
              .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
              .call('fund', [])
              .send(transaction),
          bid: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            appIndex: number,
            price: number
          ) => new Transaction(algod.client, { fromAddress, appIndex })
            .pay(price)
            .call('bid', [])
            .send(transaction)
        },
        dutch : {
          create: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            nftAppID: number,
            nftID: number,
            priceMin: number,
            priceMax: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod.client, { fromAddress })
            .createApp([
              longToByteArray(nftAppID, 8),
              longToByteArray(nftID, 32),
              longToByteArray(priceMax * 1_000_000, 8),
              longToByteArray(priceMin * 1_000_000, 8),
              longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
              algosdk.decodeAddress(accountFeesAddress).publicKey,
              longToByteArray(accountFees, 8)
            ], approvalProgram, clearProgram)
            .fund()
            .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
            .call('fund', [])
            .send(transaction),
          buy: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            nftAppID: number,
            appIndex: number,
            sellerAddress: string,
            price: number,
            feesAppAddress: string,
            feesAppId: number
          ) => new Transaction(algod.client, { fromAddress, appIndex })
            .preValidate([sellerAddress], [nftAppID])
            .pay(price)
            .call('buy', [], [feesAppAddress], [feesAppId])
            .send(transaction)
        }
      },
      rwa: {
        sale: {
          create: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            rwaId: string,
            rwaName: string,
            price: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod.client, { fromAddress })
              .createApp([
                longToByteArray(price * 1_000_000, 8),
                new TextEncoder().encode(rwaId),
                new TextEncoder().encode(rwaName),
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8),
              ], approvalProgram, clearProgram)
              .fund()
              .call('fund', [])
              .send(transaction),
          buy: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            appIndex: number,
            price: number,
            feesAppAddress: string,
            feesAppId: number
          ) => new Transaction(algod.client, { fromAddress, appIndex })
            .pay(price)
            .call('buy', [],[feesAppAddress], [feesAppId])
            .send(transaction),
        }
      }
    },
    arc200: {
      arc72: {
        sale: {
          create: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            nftID: number,
            price: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod.client, { fromAddress })
              .createApp([
                longToByteArray(nftAppID, 8),
                longToByteArray(nftID, 32),
                longToByteArray(price, 8),
                longToByteArray(arc200AppID, 8),
                algosdk.decodeAddress(arc200AppAddress).publicKey,
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8),
              ], approvalProgram, clearProgram)
              .fund()
              .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
              .call('fund', [])
              .send(transaction),
          buy: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            appIndex: number,
            sellerAddress: string,
            price: number,
            feesAppAddress: string,
            feesAppId: number,
            arc200FeesAppId: number
          ) => new Transaction(algod.client, { fromAddress, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [price])
            .preValidate([sellerAddress], [nftAppID, arc200AppID, appIndex])
            .call('buy', [], [feesAppAddress], [feesAppId, arc200FeesAppId])
            .send(transaction),
        },
        auction: {
          create: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            nftID: number,
            startPrice: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod.client, { fromAddress })
              .createApp([
                longToByteArray(nftAppID, 8),
                longToByteArray(nftID, 32),
                longToByteArray(startPrice, 8),
                longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                longToByteArray(arc200AppID, 8),
                algosdk.decodeAddress(arc200AppAddress).publicKey,
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8),
              ], approvalProgram, clearProgram, 9, 9)
              .fund()
              .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
              .call('fund', [])
              .send(transaction),
          bid: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            appIndex: number,
            price: number
          ) => new Transaction(algod.client, { fromAddress, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [price])
            .call('bid', [longToByteArray(price, 8)])
            .send(transaction)
        },
        dutch : {
          create: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            nftID: number,
            priceMin: number,
            priceMax: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod.client, { fromAddress })
            .createApp([
              longToByteArray(nftAppID, 8),
              longToByteArray(nftID, 32),
              longToByteArray(priceMax, 8),
              longToByteArray(priceMin, 8),
              longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
              longToByteArray(arc200AppID, 8),
              algosdk.decodeAddress(arc200AppAddress).publicKey,
              algosdk.decodeAddress(accountFeesAddress).publicKey,
              longToByteArray(accountFees, 8),
            ], approvalProgram, clearProgram, 9, 9)
            .fund()
            .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
            .call('fund', [])
            .send(transaction),
          buy: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            appIndex: number,
            sellerAddress: string,
            price: number,
            feesAppAddress: string,
            feesAppId: number,
            arc200FeesAppId: number
          ) => new Transaction(algod.client, { fromAddress, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [price])
            .preValidate([sellerAddress], [nftAppID, arc200AppID, appIndex])
            .preValidate()
            .call('buy', [longToByteArray(price, 8)], [feesAppAddress], [feesAppId, arc200FeesAppId])
            .send(transaction)
        }
      },
      rwa: {
        sale: {
          create: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            rwaId: string,
            rwaName: string,
            price: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod.client, { fromAddress })
              .createApp([
                longToByteArray(price, 8),
                new TextEncoder().encode(rwaId),
                new TextEncoder().encode(rwaName),
                longToByteArray(arc200AppID, 8),
                algosdk.decodeAddress(arc200AppAddress).publicKey,
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8),
              ], approvalProgram, clearProgram)
              .fund()
              .call('fund', [])
              .send(transaction),
          buy: (
            algod: AlgodClient,
            transaction: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            appIndex: number,
            price: number,
            feesAppAddress: string,
            feesAppId: number,
            arc200FeesAppId: number
          ) => new Transaction(algod.client, { fromAddress, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [price])
            .call('buy', [], [feesAppAddress], [feesAppId, arc200FeesAppId])
            .send(transaction)
        }
      }
    }
  },
  common: {
    close: (
      algod: AlgodClient,
      transaction: TransactionSigner,
      fromAddress: string,
      appIndex: number,
      feesAppAddress: string,
      feesAppId: number
    ) => new Transaction(algod.client, { fromAddress, appIndex })
      .preValidate()
      .call('close', [], [fromAddress, feesAppAddress], [appIndex, feesAppId])
      .send(transaction),
    cancel: (
      algod: AlgodClient,
      transaction: TransactionSigner,
      fromAddress: string,
      appIndex: number,
    ) => new Transaction(algod.client, { fromAddress, appIndex })
      .delete()
      .send(transaction),
  }
}
