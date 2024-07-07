import { Transaction } from '@/lib//transaction/Transaction'
import { AlgodClient } from '@/lib/algod/AlgodClient'
import { longToByteArray } from '@/utils'
import type Wallet from '@/lib/wallets/Wallet'
import { arc72Schema } from '@/lib/contracts/abi/arc72'
import type { ABI } from '@/lib/contracts/abi/types'
import algosdk from 'algosdk'
import arc200Schema from '@/lib/contracts/abi/arc200'

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
            clearProgram: string
          ) => new Transaction(algod, { fromAddress, nftAppID, nftID })
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
            clearProgram: string
          ) => new Transaction(algod, { fromAddress, nftAppID, nftID })
              .createApp([
                longToByteArray(startPrice * 1_000_000, 8),
                longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8)
              ], approvalProgram, clearProgram)
              .fund()
              .approve(arc72Schema as ABI, 'arc72_approve')
              .call('fund')
              .send(wallet),
          bid: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            nftAppID: number,
            nftID: number,
            appIndex: number,
            price: number
          ) => new Transaction(algod, { fromAddress, nftAppID, nftID, appIndex })
            .pay(price)
            .call('bid')
            .send(wallet)
        },
        dutch : {
          create: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            nftAppID: number,
            nftID: number,
            priceMin: number,
            priceMax: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string
          ) => new Transaction(algod, { fromAddress, nftAppID, nftID })
            .createApp([
              longToByteArray(priceMax * 1_000_000, 8),
              longToByteArray(priceMin * 1_000_000, 8),
              longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8)
            ], approvalProgram, clearProgram)
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
        }
      },
      rwa: {
        sale: {
          create: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            rwaId: string,
            rwaName: string,
            feesAddress: string,
            price: number,
            approvalProgram: string,
            clearProgram: string
          ) => new Transaction(algod, { fromAddress })
              .createApp([
                longToByteArray(price * 1_000_000, 8),
                algosdk.decodeAddress(feesAddress).publicKey,
                new TextEncoder().encode(rwaId),
                new TextEncoder().encode(rwaName)
              ], approvalProgram, clearProgram)
              .fund()
              .call('fund')
              .send(wallet),
          buy: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            appIndex: number,
            price: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .pay(price)
            .call('buy')
            .send(wallet),
        }
      }
    },
    arc200: {
      arc72: {
        sale: {
          create: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            nftID: number,
            price: number,
            approvalProgram: string,
            clearProgram: string
          ) => new Transaction(algod, { fromAddress, nftAppID, nftID })
              .createApp([
                longToByteArray(price * 1_000_000, 8),
                longToByteArray(arc200AppID, 8),
                algosdk.decodeAddress(arc200AppAddress).publicKey
              ], approvalProgram, clearProgram)
              .fund()
              .approve(arc72Schema as ABI, 'arc72_approve')
              .call('fund')
              .send(wallet),
          buy: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            nftID: number,
            appIndex: number,
            sellerAddress: string,
            feesAddress: string,
            price: number
          ) => new Transaction(algod, { fromAddress, nftAppID, nftID, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, arc200AppID, price)
            .preValidate(sellerAddress, feesAddress, [arc200AppID, appIndex])
            .call('buy')
            .send(wallet),
        },
        auction: {
          create: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            nftID: number,
            startPrice: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string
          ) => new Transaction(algod, { fromAddress, nftAppID, nftID })
              .createApp([
                longToByteArray(startPrice * 1_000_000, 8),
                longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                longToByteArray(arc200AppID, 8),
                algosdk.decodeAddress(arc200AppAddress).publicKey
              ], approvalProgram, clearProgram)
              .fund()
              .approve(arc72Schema as ABI, 'arc72_approve')
              .call('fund')
              .send(wallet),
          bid: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            nftID: number,
            appIndex: number,
            price: number
          ) => new Transaction(algod, { fromAddress, nftAppID, nftID, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, arc200AppID, price)
            .call('bid', [longToByteArray(price, 8)])
            .send(wallet)
        },
        dutch : {
          create: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            nftID: number,
            priceMin: number,
            priceMax: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string
          ) => new Transaction(algod, { fromAddress, nftAppID, nftID })
            .createApp([
              longToByteArray(priceMax * 1_000_000, 8),
              longToByteArray(priceMin * 1_000_000, 8),
              longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
              longToByteArray(arc200AppID, 8),
              algosdk.decodeAddress(arc200AppAddress).publicKey
            ], approvalProgram, clearProgram)
            .fund()
            .approve(arc72Schema as ABI, 'arc72_approve')
            .call('fund')
            .send(wallet),
          buy: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            nftID: number,
            appIndex: number,
            sellerAddress: string,
            feesAddress: string,
            price: number
          ) => new Transaction(algod, { fromAddress, nftAppID, nftID, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, arc200AppID, price)
            .preValidate(sellerAddress, feesAddress, [arc200AppID, appIndex])
            .call('buy', [longToByteArray(price, 8)])
            .send(wallet)
        }
      },
      rwa: {
        sale: {
          create: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            rwaId: string,
            rwaName: string,
            price: number,
            approvalProgram: string,
            clearProgram: string
          ) => new Transaction(algod, { fromAddress })
              .createApp([
                longToByteArray(price * 1_000_000, 8),
                new TextEncoder().encode(rwaId),
                new TextEncoder().encode(rwaName),
                longToByteArray(arc200AppID, 8),
                algosdk.decodeAddress(arc200AppAddress).publicKey
              ], approvalProgram, clearProgram)
              .fund()
              .call('fund')
              .send(wallet),
          buy: (
            algod: AlgodClient,
            wallet: Wallet,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            appIndex: number,
            sellerAddress: string,
            feesAddress: string,
            price: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, arc200AppID, price)
            .call('buy', [longToByteArray(price, 8)])
            .send(wallet)
        }
      }
    }
  }
}