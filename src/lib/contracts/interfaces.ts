import {Transaction, type TransactionConfirmation} from '@/lib//transaction/Transaction'
import {longToByteArray} from '@/lib/utils'
import {arc72Schema} from '@/lib/contracts/abi/arc72'
import {arc200Schema} from '@/lib/contracts/abi/arc200'
import type {ABI} from '@/lib/contracts/abi/types'
import algosdk, {type Algodv2, type TransactionSigner} from 'algosdk'

type CreateApp = (
    algod: Algodv2,
    signer: TransactionSigner,
    approvalProgram: string,
    clearProgram: string,
    fromAddress: string,
    accountFeesAddress: string,
    accountFees: number,
    ...args: any[]
) => Promise<TransactionConfirmation>;

type FundApp = (
    algod: Algodv2,
    signer: TransactionSigner,
    fromAddress: string,
    appIndex: number,
    ...args: any[]
) => Promise<TransactionConfirmation>;

type Buy = (
    algod: Algodv2,
    signer: TransactionSigner,
    appIndex: number,
    fromAddress: string,
    sellerAddress: string,
    feesAppAddress: string,
    feesAppId: number,
    price: number,
    ...args: any[]
) => Promise<TransactionConfirmation>;

type Bid = (
    algod: Algodv2,
    signer: TransactionSigner,
    appIndex: number,
    fromAddress: string,
    price: number,
    ...args: any[]
) => Promise<TransactionConfirmation>;

export interface SaleInterface {
    create: CreateApp;
    fund: FundApp;
    buy: Buy;
}

export interface AuctionInterface {
    create: CreateApp;
    fund: FundApp;
    bid: Bid;
}

export interface DutchInterface {
    create: CreateApp;
    fund: FundApp;
    buy: Buy;
}

export interface OffchainInterface {
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
    chain: 'voi',
    voi: VoiVoiInterface
    arc200: VoiArc200Interface
}

export interface VoiVoiInterface {
    arc72: Arc72Interface;
    offchain: OffchainInterface;
}

export interface VoiArc200Interface {
    arc72: Arc72Interface;
    offchain: OffchainInterface;
}

export interface AlgoInterface {
    chain: 'algo',
    algo: AlgoAlgoInterface;
    asa: AlgoASAInterface;
}

export interface AlgoAlgoInterface {
    asa: ASAInterface;
    offchain: OffchainInterface;
}

export interface AlgoASAInterface {
    asa: ASAInterface;
    offchain: OffchainInterface;
}

export interface CommonInterface {
    close: (
        algod: Algodv2,
        signer: TransactionSigner,
        fromAddress: string,
        appIndex: number,
        feesAppAddress: string,
        feesAppId: number,
        sellerAddress: string,
        nftID?: number,
        asaID?: number
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

export type CurrencyInterface = VoiVoiInterface | VoiArc200Interface | AlgoAlgoInterface | AlgoASAInterface
export type AssetInterface = Arc72Interface | ASAInterface

export const interfaces: Interfaces = {
    voi: {
        chain: 'voi',
        voi: {
            arc72: {
                sale: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        nftAppID: number,
                        nftID: number,
                        price: number,
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(nftAppID, 8),
                            longToByteArray(nftID, 32),
                            longToByteArray(price * 1_000_000, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                        ], approvalProgram, clearProgram)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        nftAppID: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund()
                        .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
                        .call('fund', [])
                        .send(signer),
                    buy: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number,
                        nftAppID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .preValidate([sellerAddress], [nftAppID])
                        .pay(price)
                        .call('buy', [], [feesAppAddress], [feesAppId])
                        .send(signer)
                },
                auction: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        nftAppID: number,
                        nftID: number,
                        startPrice: number,
                        duration: number,
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(nftAppID, 8),
                            longToByteArray(nftID, 32),
                            longToByteArray(startPrice * 1_000_000, 8),
                            longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                        ], approvalProgram, clearProgram)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        nftAppID: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund()
                        .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
                        .call('fund', [])
                        .send(signer),
                    bid: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
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
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        nftAppID: number,
                        nftID: number,
                        priceMin: number,
                        priceMax: number,
                        duration: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(nftAppID, 8),
                            longToByteArray(nftID, 32),
                            longToByteArray(priceMax * 1_000_000, 8),
                            longToByteArray(priceMin * 1_000_000, 8),
                            longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                        ], approvalProgram, clearProgram)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        nftAppID: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund()
                        .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
                        .call('fund', [])
                        .send(signer),
                    buy: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number,
                        nftAppID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .preValidate([sellerAddress], [nftAppID])
                        .pay(price)
                        .call('buy', [], [feesAppAddress], [feesAppId])
                        .send(signer)
                }
            },
            offchain: {
                sale: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        offchainAssetId: string,
                        offchainAssetName: string,
                        price: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(price * 1_000_000, 8),
                            new TextEncoder().encode(offchainAssetId),
                            new TextEncoder().encode(offchainAssetName),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
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
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .pay(price)
                        .call('buy', [], [feesAppAddress], [feesAppId])
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
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        arc200AppID: number,
                        arc200AppAddress: string,
                        nftAppID: number,
                        nftID: number,
                        price: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(nftAppID, 8),
                            longToByteArray(nftID, 32),
                            longToByteArray(price, 8),
                            longToByteArray(arc200AppID, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                        ], approvalProgram, clearProgram)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        arc200AppID: number,
                        arc200AppAddress: string,
                        nftAppID: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund()
                        .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
                        .call('fund', [])
                        .send(signer),
                    buy: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number,
                        arc200AppID: number,
                        arc200AppAddress: string,
                        nftAppID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .pay(28500 / 1_000_000, arc200AppAddress)
                        .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [price])
                        .preValidate([sellerAddress], [nftAppID, arc200AppID, appIndex])
                        .call('buy', [], [feesAppAddress], [feesAppId])
                        .send(signer),
                },
                auction: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        arc200AppID: number,
                        arc200AppAddress: string,
                        nftAppID: number,
                        nftID: number,
                        startPrice: number,
                        duration: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(nftAppID, 8),
                            longToByteArray(nftID, 32),
                            longToByteArray(startPrice, 8),
                            longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                            longToByteArray(arc200AppID, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                        ], approvalProgram, clearProgram, 9, 9)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        arc200AppID: number,
                        arc200AppAddress: string,
                        nftAppID: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund()
                        .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
                        .call('fund', [])
                        .send(signer),
                    bid: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
                        price: number,
                        arc200AppID: number,
                        arc200AppAddress: string
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .pay(28500 / 1_000_000, arc200AppAddress)
                        .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [price])
                        .call('bid', [longToByteArray(price, 8)])
                        .send(signer)
                },
                dutch: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        arc200AppID: number,
                        arc200AppAddress: string,
                        nftAppID: number,
                        nftID: number,
                        priceMin: number,
                        priceMax: number,
                        duration: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(nftAppID, 8),
                            longToByteArray(nftID, 32),
                            longToByteArray(priceMax, 8),
                            longToByteArray(priceMin, 8),
                            longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                            longToByteArray(arc200AppID, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                        ], approvalProgram, clearProgram, 9, 9)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        arc200AppID: number,
                        arc200AppAddress: string,
                        nftAppID: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund()
                        .approve(arc72Schema as ABI, 'arc72_approve', nftAppID, [nftAppID], [nftID])
                        .call('fund', [])
                        .send(signer),
                    buy: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number,
                        arc200AppID: number,
                        arc200AppAddress: string,
                        nftAppID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .pay(28500 / 1_000_000, arc200AppAddress)
                        .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [Math.ceil(price)])
                        .preValidate([sellerAddress], [nftAppID, arc200AppID, appIndex])
                        .preValidate()
                        .call('buy', [longToByteArray(Math.ceil(price), 8)], [feesAppAddress], [feesAppId])
                        .send(signer)
                }
            },
            offchain: {
                sale: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        arc200AppID: number,
                        arc200AppAddress: string,
                        offchainAssetId: string,
                        offchainAssetName: string,
                        price: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(price, 8),
                            new TextEncoder().encode(offchainAssetId),
                            new TextEncoder().encode(offchainAssetName),
                            longToByteArray(arc200AppID, 8),
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
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number,
                        arc200AppID: number,
                        arc200AppAddress: string
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .pay(28500 / 1_000_000, arc200AppAddress)
                        .approve(arc200Schema as ABI, 'arc200_transfer', arc200AppID, [arc200AppID], [price])
                        .call('buy', [], [feesAppAddress], [feesAppId])
                        .send(signer)
                }
            }
        }
    },
    algo: {
        chain: 'algo',
        algo: {
            asa: {
                sale: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        nftID: number,
                        price: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(nftID, 8),
                            longToByteArray(price * 1_000_000, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                        ], approvalProgram, clearProgram)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund(500_000)
                        .call('fund', [])
                        .transferAsset(nftID, 1)
                        .send(signer),
                    buy: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number,
                        nftID: number
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
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        nftID: number,
                        startPrice: number,
                        duration: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(nftID, 8),
                            longToByteArray(startPrice * 1_000_000, 8),
                            longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                        ], approvalProgram, clearProgram)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund()
                        .call('fund', [])
                        .transferAsset(nftID, 1)
                        .send(signer),
                    bid: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
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
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        nftID: number,
                        priceMin: number,
                        priceMax: number,
                        duration: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(nftID, 8),
                            longToByteArray(priceMax * 1_000_000, 8),
                            longToByteArray(priceMin * 1_000_000, 8),
                            longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                        ], approvalProgram, clearProgram)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund()
                        .call('fund', [])
                        .transferAsset(nftID, 1)
                        .send(signer),
                    buy: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .preValidate([sellerAddress], [])
                        .optIn(nftID)
                        .pay(price)
                        .call('buy', [], [feesAppAddress, sellerAddress], [feesAppId], [nftID])
                        .send(signer)
                }
            },
            offchain: {
                sale: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        offchainAssetId: string,
                        offchainAssetName: string,
                        price: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(price * 1_000_000, 8),
                            new TextEncoder().encode(offchainAssetId),
                            new TextEncoder().encode(offchainAssetName),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
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
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .pay(price)
                        .call('buy', [], [feesAppAddress], [feesAppId])
                        .send(signer),
                }
            }
        },
        asa: {
            asa: {
                sale: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        asaID: number,
                        asaDecimals: number,
                        nftID: number,
                        price: number
                    ) => {
                        return new Transaction(algod, {fromAddress})
                            .createApp([
                                longToByteArray(nftID, 8),
                                longToByteArray(price * asaDecimals, 8),
                                algosdk.decodeAddress(accountFeesAddress).publicKey,
                                longToByteArray(asaID, 8),
                            ], approvalProgram, clearProgram)
                            .send(signer)
                    },
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        asaID: number,
                        asaDecimals: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund(500_000)
                        .call('fund', [], [], [], [asaID])
                        .transferAsset(nftID, 1)
                        .send(signer),
                    buy: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number,
                        asaID: number,
                        asaDecimals: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .preValidate([sellerAddress], [], [asaID, nftID])
                        .optIn(nftID)
                        .transferAsset(asaID, price * asaDecimals)
                        .call('buy', [], [sellerAddress, feesAppAddress], [feesAppId], [asaID, nftID])
                        .send(signer)
                },
                auction: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        asaID: number,
                        asaDecimals: number,
                        nftID: number,
                        startPrice: number,
                        duration: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(nftID, 8),
                            longToByteArray(startPrice * asaDecimals, 8),
                            longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                            longToByteArray(asaID, 8),
                        ], approvalProgram, clearProgram, 9)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        asaID: number,
                        appIndex: number,
                        asaDecimals: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund()
                        .call('fund', [], [], [], [asaID])
                        .transferAsset(nftID, 1)
                        .send(signer),
                    bid: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
                        price: number,
                        asaID: number,
                        asaDecimals: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .transferAsset(asaID, price * asaDecimals)
                        .call('bid', [])
                        .send(signer)
                },
                dutch: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        asaID: number,
                        asaDecimals: number,
                        nftID: number,
                        priceMin: number,
                        priceMax: number,
                        duration: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(nftID, 8),
                            longToByteArray(priceMax * asaDecimals, 8),
                            longToByteArray(priceMin * asaDecimals, 8),
                            longToByteArray((Date.now() + duration * 3_600_000) / 1_000, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                            longToByteArray(asaID, 8),
                        ], approvalProgram, clearProgram, 9)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        asaID: number,
                        asaDecimals: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund()
                        .call('fund', [], [], [], [asaID])
                        .transferAsset(nftID, 1)
                        .send(signer),
                    buy: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number,
                        asaID: number,
                        asaDecimals: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .preValidate([sellerAddress], [], [asaID, nftID])
                        .optIn(nftID)
                        .transferAsset(asaID, price * asaDecimals)
                        .call('buy', [], [sellerAddress, feesAppAddress], [feesAppId], [asaID, nftID])
                        .send(signer)
                }
            },
            offchain: {
                sale: {
                    create: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        approvalProgram: string,
                        clearProgram: string,
                        fromAddress: string,
                        accountFeesAddress: string,
                        accountFees: number,
                        asaID: number,
                        asaDecimals: number,
                        offchainAssetId: string,
                        offchainAssetName: string,
                        price: number
                    ) => new Transaction(algod, {fromAddress})
                        .createApp([
                            longToByteArray(price * asaDecimals, 8),
                            new TextEncoder().encode(offchainAssetId),
                            new TextEncoder().encode(offchainAssetName),
                            longToByteArray(asaID, 8),
                            algosdk.decodeAddress(accountFeesAddress).publicKey,
                        ], approvalProgram, clearProgram)
                        .send(signer),
                    fund: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        fromAddress: string,
                        appIndex: number,
                        asaID: number,
                        asaDecimals: number,
                        nftID: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .fund()
                        .call('fund', [], [], [], [asaID])
                        .send(signer),
                    buy: (
                        algod: Algodv2,
                        signer: TransactionSigner,
                        appIndex: number,
                        fromAddress: string,
                        sellerAddress: string,
                        feesAppAddress: string,
                        feesAppId: number,
                        price: number,
                        asaID: number,
                        asaDecimals: number
                    ) => new Transaction(algod, {fromAddress, appIndex})
                        .transferAsset(asaID, price * asaDecimals)
                        .call('buy', [], [sellerAddress, feesAppAddress], [feesAppId], [asaID])
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
            sellerAddress: string,
            nftID?: number,
            asaID?: number
        ) => {
            const foreignAssets = []
            if (nftID) foreignAssets.push(nftID)
            if (asaID) foreignAssets.push(asaID)
            const accounts = [fromAddress, feesAppAddress, sellerAddress]
            return new Transaction(algod, {fromAddress, appIndex})
                .preValidate(undefined, [appIndex, feesAppId], foreignAssets)
                .preValidate(undefined, [appIndex], foreignAssets)
                .call('close', [], accounts, [appIndex, feesAppId], foreignAssets)
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
            return new Transaction(algod, {fromAddress, appIndex})
                .delete(foreignAssets)
                .send(signer)
        },
    }
}
