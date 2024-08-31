import { Transaction, type TransactionConfirmation } from '@/lib//transaction/Transaction'
import { longToByteArray } from '@/lib/utils'
import { arc72Schema } from '@/lib/contracts/abi/arc72'
import { arc200Schema } from '@/lib/contracts/abi/arc200'
import type { ABI } from '@/lib/contracts/abi/types'
import algosdk, {type TransactionSigner, type Algodv2} from 'algosdk'

export interface SaleInterface {
  create: (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    ...args: any[]
  ) => Promise<TransactionConfirmation>;
  fund: (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    appIndex: number,
    ...args: any[]
  )=> Promise<TransactionConfirmation>;
  buy: (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    ...args: any[]
  ) => Promise<TransactionConfirmation>;
}

export interface AuctionInterface {
  create: (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    ...args: any[]
  ) => Promise<TransactionConfirmation>;
  fund: (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    appIndex: number,
    ...args: any[]
  )=> Promise<TransactionConfirmation>;
  bid: (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    ...args: any[]
  ) => Promise<TransactionConfirmation>;
}

export interface DutchInterface {
  create: (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    ...args: any[]
  ) => Promise<TransactionConfirmation>;
  fund: (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    appIndex: number,
    ...args: any[]
  )=> Promise<TransactionConfirmation>;
  buy: (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    ...args: any[]
  ) => Promise<TransactionConfirmation>;
}

export interface RwaInterface {
  sale: SaleInterface;
}

export interface Arc72Interface {
  sale: SaleInterface;
  auction: AuctionInterface;
  dutch: DutchInterface;
}

export interface ASAInterface {
  sale: SaleInterface;
  auction: AuctionInterface;
  dutch: DutchInterface;
}

export interface VoiInterface {
  voi: {
    arc72: Arc72Interface;
    rwa: RwaInterface;
  };
  arc200: {
    arc72: Arc72Interface;
    rwa: RwaInterface;
  };
}

export interface AlgoInterface {
  algo: {
    ASA: ASAInterface;
  };
  ASA: {
    ASA: ASAInterface;
    rwa: RwaInterface
  };
}

export interface CommonInterface {
  close: (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    appIndex: number,
    feesAppAddress: string,
    feesAppId: number,
    nftID?: number
  ) => Promise<TransactionConfirmation>;
  cancel: (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    appIndex: number,
    nftID?: number
  ) => Promise<TransactionConfirmation>;
}

export interface Interfaces {
  voi: VoiInterface;
  algo: AlgoInterface;
  common: CommonInterface;
}

export const interfaces:Interfaces = {
  voi: {
    voi: {
      arc72: {
        sale: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftAppID: number,
            nftID: number,
            price: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod, { fromAddress })
              .createApp([
                longToByteArray(nftAppID, 8),
                longToByteArray(nftID, 32),
                longToByteArray(price * 1_000_000, 8),
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8)
              ], approvalProgram, clearProgram)
              .send(signer),
          fund: (
              algod: Algodv2,
              signer: TransactionSigner,
              fromAddress: string,
              nftAppID: number,
              nftID: number,
              appIndex: number
          ) => new Transaction(algod, {fromAddress, appIndex})
              .fund()
              .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
              .call('fund', [])
              .send(signer),
          buy: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftAppID: number,
            appIndex: number,
            sellerAddress: string,
            price: number,
            feesAppAddress: string,
            feesAppId: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .preValidate([sellerAddress], [nftAppID])
            .pay(price)
            .call('buy', [], [feesAppAddress], [feesAppId])
            .send(signer)
        },
        auction: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftAppID: number,
            nftID: number,
            startPrice: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod, { fromAddress })
              .createApp([
                longToByteArray(nftAppID, 8),
                longToByteArray(nftID, 32),
                longToByteArray(startPrice * 1_000_000, 8),
                longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8)
              ], approvalProgram, clearProgram)
              .send(signer),
          fund: (
              algod: Algodv2,
              signer: TransactionSigner,
              fromAddress: string,
              nftAppID: number,
              nftID: number,
              appIndex: number
          ) => new Transaction(algod, { fromAddress, appIndex })
              .fund()
              .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
              .call('fund', [])
              .send(signer),
          bid: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            appIndex: number,
            price: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .pay(price)
            .call('bid', [])
            .send(signer)
        },
        dutch : {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
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
          ) => new Transaction(algod, { fromAddress })
            .createApp([
              longToByteArray(nftAppID, 8),
              longToByteArray(nftID, 32),
              longToByteArray(priceMax * 1_000_000, 8),
              longToByteArray(priceMin * 1_000_000, 8),
              longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
              algosdk.decodeAddress(accountFeesAddress).publicKey,
              longToByteArray(accountFees, 8)
            ], approvalProgram, clearProgram)
            .send(signer),
          fund: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftAppID: number,
            nftID: number,
            appIndex: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .fund()
            .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
            .call('fund', [])
            .send(signer),
          buy: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftAppID: number,
            appIndex: number,
            sellerAddress: string,
            price: number,
            feesAppAddress: string,
            feesAppId: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .preValidate([sellerAddress], [nftAppID])
            .pay(price)
            .call('buy', [], [feesAppAddress], [feesAppId])
            .send(signer)
        }
      },
      rwa: {
        sale: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            rwaId: string,
            rwaName: string,
            price: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod, { fromAddress })
              .createApp([
                longToByteArray(price * 1_000_000, 8),
                new TextEncoder().encode(rwaId),
                new TextEncoder().encode(rwaName),
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8),
              ], approvalProgram, clearProgram)
              .send(signer),
          fund: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            appIndex: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .fund()
            .call('fund', [])
            .send(signer),
          buy: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            appIndex: number,
            price: number,
            feesAppAddress: string,
            feesAppId: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .pay(price)
            .call('buy', [],[feesAppAddress], [feesAppId])
            .send(signer),
        }
      }
    },
    arc200: {
      arc72: {
        sale: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
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
          ) => new Transaction(algod, { fromAddress })
              .createApp([
                longToByteArray(nftAppID, 8),
                longToByteArray(nftID, 32),
                longToByteArray(price, 8),
                longToByteArray(arc200AppID, 8),
                algosdk.decodeAddress(arc200AppAddress).publicKey,
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8),
              ], approvalProgram, clearProgram)
              .send(signer),
            fund: (
                algod: Algodv2,
                signer: TransactionSigner,
                fromAddress: string,
                nftAppID: number,
                nftID: number,
                appIndex: number
            ) => new Transaction(algod, {fromAddress, appIndex})
                .fund()
                .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
                .call('fund', [])
                .send(signer),
          buy: (
            algod: Algodv2,
            signer: TransactionSigner,
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
          ) => new Transaction(algod, { fromAddress, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [price])
            .preValidate([sellerAddress], [nftAppID, arc200AppID, appIndex])
            .call('buy', [], [feesAppAddress], [feesAppId, arc200FeesAppId])
            .send(signer),
        },
        auction: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
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
          ) => new Transaction(algod, { fromAddress })
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
              .send(signer),
          fund: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            nftID: number,
            appIndex: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .fund()
            .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
            .call('fund', [])
            .send(signer),
          bid: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            appIndex: number,
            price: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [price])
            .call('bid', [longToByteArray(price, 8)])
            .send(signer)
        },
        dutch : {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
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
          ) => new Transaction(algod, { fromAddress })
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
            .send(signer),
          fund: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            nftAppID: number,
            nftID: number,
            appIndex: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .fund()
            .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
            .call('fund', [])
            .send(signer),
          buy: (
            algod: Algodv2,
            signer: TransactionSigner,
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
          ) => new Transaction(algod, { fromAddress, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [price])
            .preValidate([sellerAddress], [nftAppID, arc200AppID, appIndex])
            .preValidate()
            .call('buy', [longToByteArray(price, 8)], [feesAppAddress], [feesAppId, arc200FeesAppId])
            .send(signer)
        }
      },
      rwa: {
        sale: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
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
          ) => new Transaction(algod, { fromAddress })
              .createApp([
                longToByteArray(price, 8),
                new TextEncoder().encode(rwaId),
                new TextEncoder().encode(rwaName),
                longToByteArray(arc200AppID, 8),
                algosdk.decodeAddress(arc200AppAddress).publicKey,
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8),
              ], approvalProgram, clearProgram)
              .send(signer),
            fund: (
                algod: Algodv2,
                signer: TransactionSigner,
                fromAddress: string,
                appIndex: number
            ) => new Transaction(algod, {fromAddress, appIndex})
                .fund()
                .call('fund', [])
                .send(signer),
          buy: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            arc200AppID: number,
            arc200AppAddress: string,
            appIndex: number,
            price: number,
            feesAppAddress: string,
            feesAppId: number,
            arc200FeesAppId: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .pay(28500 / 1_000_000, arc200AppAddress)
            .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [price])
            .call('buy', [], [feesAppAddress], [feesAppId, arc200FeesAppId])
            .send(signer)
        }
      }
    }
  },
  algo: {
    algo: {
      ASA: {
        sale: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftID: number,
            price: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod, {fromAddress})
            .createApp([
              longToByteArray(nftID, 8),
              longToByteArray(price * 1_000_000, 8),
              algosdk.decodeAddress(accountFeesAddress).publicKey,
              longToByteArray(accountFees, 8)
            ], approvalProgram, clearProgram)
            .send(signer),
          fund: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftID: number,
            appIndex: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .fund(500_000)
            .call('fund', [])
            .transferAsset(nftID, 1)
            .send(signer),
          buy: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftID: number,
            appIndex: number,
            sellerAddress: string,
            price: number,
            feesAppAddress: string,
            feesAppId: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .preValidate([sellerAddress], [])
            .optIn(nftID)
            .pay(price)
            .call('buy', [], [feesAppAddress, sellerAddress], [feesAppId], [nftID])
            .send(signer)
        },
        auction: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftID: number,
            startPrice: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod, {fromAddress})
            .createApp([
              longToByteArray(nftID, 8),
              longToByteArray(startPrice * 1_000_000, 8),
              longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
              algosdk.decodeAddress(accountFeesAddress).publicKey,
              longToByteArray(accountFees, 8)
            ], approvalProgram, clearProgram)
            .send(signer),
          fund: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftID: number,
            appIndex: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .fund()
            .call('fund', [])
            .transferAsset(nftID, 1)
            .send(signer),
          bid: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            appIndex: number,
            price: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .pay(price)
            .call('bid', [])
            .send(signer)
        },
        dutch: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftID: number,
            priceMin: number,
            priceMax: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod, {fromAddress})
            .createApp([
              longToByteArray(nftID, 8),
              longToByteArray(priceMax * 1_000_000, 8),
              longToByteArray(priceMin * 1_000_000, 8),
              longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
              algosdk.decodeAddress(accountFeesAddress).publicKey,
              longToByteArray(accountFees, 8)
            ], approvalProgram, clearProgram)
            .send(signer),
          fund: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftID: number,
            appIndex: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .fund()
            .call('fund', [])
            .transferAsset(nftID, 1)
            .send(signer),
          buy: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            nftID: number,
            appIndex: number,
            sellerAddress: string,
            price: number,
            feesAppAddress: string,
            feesAppId: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .preValidate([sellerAddress], [])
            .optIn(nftID)
            .pay(price)
            .call('buy', [], [feesAppAddress, sellerAddress], [feesAppId], [nftID])
            .send(signer)
        }
      }
    },
    ASA: {
      ASA: {
        sale: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            asaID: number,
            asaDecimals: number,
            nftID: number,
            price: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => {
            return new Transaction(algod, {fromAddress})
              .createApp([
                longToByteArray(nftID, 8),
                longToByteArray(price * asaDecimals, 8),
                algosdk.decodeAddress(accountFeesAddress).publicKey,
                longToByteArray(accountFees, 8),
                longToByteArray(asaID, 8),
              ], approvalProgram, clearProgram)
              .send(signer)
          },
          fund: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            asaID: number,
            asaDecimals: number,
            nftID: number,
            appIndex: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .fund(500_000)
            .call('fund', [], [],[], [asaID])
            .transferAsset(nftID, 1)
            .send(signer),
          buy: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            asaID: number,
            asaDecimals: number,
            nftID: number,
            appIndex: number,
            sellerAddress: string,
            price: number,
            feesAppAddress: string,
            feesAppId: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .preValidate([sellerAddress], [])
            .optIn(nftID)
            .transferAsset(asaID, price * asaDecimals)
            .call('buy', [], [sellerAddress, feesAppAddress], [feesAppId], [asaID, nftID])
            .send(signer)
        },
        auction: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            asaID: number,
            asaDecimals: number,
            nftID: number,
            startPrice: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod, {fromAddress})
            .createApp([
              longToByteArray(nftID, 8),
              longToByteArray(startPrice * asaDecimals, 8),
              longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
              algosdk.decodeAddress(accountFeesAddress).publicKey,
              longToByteArray(accountFees, 8),
              longToByteArray(asaID, 8),
            ], approvalProgram, clearProgram)
            .send(signer),
          fund: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            asaID: number,
            asaDecimals: number,
            nftID: number,
            appIndex: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .fund()
            .call('fund', [], [], [], [asaID])
            .transferAsset(nftID, 1)
            .send(signer),
          bid: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            appIndex: number,
            price: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .pay(price)
            .call('bid', [])
            .send(signer)
        },
        dutch: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            asaID: number,
            asaDecimals: number,
            nftID: number,
            priceMin: number,
            priceMax: number,
            duration: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod, {fromAddress})
            .createApp([
              longToByteArray(nftID, 8),
              longToByteArray(priceMax * asaDecimals, 8),
              longToByteArray(priceMin * asaDecimals, 8),
              longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
              algosdk.decodeAddress(accountFeesAddress).publicKey,
              longToByteArray(accountFees, 8),
              longToByteArray(asaID, 8),
            ], approvalProgram, clearProgram)
            .send(signer),
          fund: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            asaID: number,
            asaDecimals: number,
            nftID: number,
            appIndex: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .fund()
            .call('fund', [], [],[], [asaID])
            .transferAsset(nftID, 1)
            .send(signer),
          buy: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            asaID: number,
            asaDecimals: number,
            nftID: number,
            appIndex: number,
            sellerAddress: string,
            price: number,
            feesAppAddress: string,
            feesAppId: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .preValidate([sellerAddress], [])
            .optIn(nftID)
            .pay(price, undefined, asaDecimals)
            .call('buy', [], [feesAppAddress], [feesAppId], [asaID, nftID])
            .send(signer)
        }
      },
      rwa: {
        sale: {
          create: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            rwaId: string,
            rwaName: string,
            price: number,
            approvalProgram: string,
            clearProgram: string,
            accountFeesAddress: string,
            accountFees: number
          ) => new Transaction(algod, { fromAddress })
            .createApp([
              longToByteArray(price * 1_000_000, 8),
              new TextEncoder().encode(rwaId),
              new TextEncoder().encode(rwaName),
              algosdk.decodeAddress(accountFeesAddress).publicKey,
              longToByteArray(accountFees, 8),
            ], approvalProgram, clearProgram)
            .send(signer),
          fund: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            appIndex: number
          ) => new Transaction(algod, {fromAddress, appIndex})
            .fund()
            .call('fund', [])
            .send(signer),
          buy: (
            algod: Algodv2,
            signer: TransactionSigner,
            fromAddress: string,
            appIndex: number,
            price: number,
            feesAppAddress: string,
            feesAppId: number
          ) => new Transaction(algod, { fromAddress, appIndex })
            .pay(price)
            .call('buy', [],[feesAppAddress], [feesAppId])
            .send(signer),
        }
      }
    },
  },
  common: {
    close: (
      algod: Algodv2,
      signer: TransactionSigner,
      fromAddress: string,
      appIndex: number,
      feesAppAddress: string,
      feesAppId: number,
      nftID?: number,
      asaID?: number,
    ) => {
      const foreignAssets = []
      if (nftID) foreignAssets.push(nftID)
      if (asaID) foreignAssets.push(asaID)
      return new Transaction(algod, {fromAddress, appIndex})
        .preValidate()
        .call('close', [], [fromAddress, feesAppAddress], [appIndex, feesAppId], foreignAssets)
        .send(signer)
    },
    cancel: (
      algod: Algodv2,
      signer: TransactionSigner,
      fromAddress: string,
      appIndex: number,
      nftID?: number,
      asaID?: number,
    ) => {
      const foreignAssets = []
      if (nftID) foreignAssets.push(nftID)
      if (asaID) foreignAssets.push(asaID)
      return new Transaction(algod, { fromAddress, appIndex })
        .delete(foreignAssets)
        .send(signer)
    },
  }
}
