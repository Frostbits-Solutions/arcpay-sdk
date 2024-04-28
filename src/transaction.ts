import type { BoxReference } from 'algosdk'
import _algosdk from 'algosdk'
import { SIMULATION_ERROR } from '@/constants'
import { TransactionType } from 'algosdk/src/types/transactions'
import type {
  AppCallObject,
  AppCreateObject,
  PaymentObject,
  TransactionObject,
  TransfertObject,
  AppObject, AppDeleteObject
} from '@/types'
import { OnApplicationComplete } from 'algosdk/src/types/transactions/base'
import type {Provider} from "@/types";
import type {Transaction as _Transaction} from "algosdk";

export class Transaction {

  objs: TransactionObject[]
  txns: _Transaction[]
  constructor (transactionsObjs: TransactionObject[]) {
    this.objs = transactionsObjs
    this.txns = []
  }

  async createTxns (algosdk: typeof _algosdk, algodClient: _algosdk.Algodv2) {
    //@ts-ignore
    const results = await this.simulateTxn(algosdk, algodClient)

    if (results?.txnGroups[0]?.failureMessage) {
      throw {
        code: SIMULATION_ERROR,
        message: results?.txnGroups[0]?.failureMessage
      }
    }
    console.log(results, results?.txnGroups[0]?.unnamedResourcesAccessed?.boxes)

    if (results?.txnGroups[0]?.unnamedResourcesAccessed?.accounts) {
      for (const obj of this.objs) {
        if (obj.type !== TransactionType.appl) {
          continue
        }
        const appObj = obj as AppObject
        const accounts = results?.txnGroups[0]?.unnamedResourcesAccessed?.accounts
        if (appObj.accounts) {
          appObj.accounts = Array.from(new Set([...appObj.accounts, ...accounts]))
        } else {
          appObj.accounts = accounts
        }
      }
    }
    if (results?.txnGroups[0]?.unnamedResourcesAccessed?.boxes) {
      let boxesStart = 0
      for (const obj of this.objs) {
        if (obj.type !== TransactionType.appl) {
          continue
        }
        const appObj = obj as AppObject
        const foreignApps: Array<number> = []

        console.log(results
          .txnGroups[0]
          .unnamedResourcesAccessed
          .boxes)
        appObj.boxes = results
          .txnGroups[0]
          .unnamedResourcesAccessed
          .boxes
          .map((x) => {
            if (x.app !== 0 &&
                //@ts-ignore
                x.app !== appObj?.appIndex &&
                !foreignApps.includes(x.app as number)){
              foreignApps.push(x.app as number)
            }
            return {
              appIndex: x.app,
              name: x.name,
            } as BoxReference
          })
        if (appObj.foreignApps) {
          appObj.foreignApps = Array.from(new Set([...appObj.foreignApps, ...foreignApps]))
        } else {
          appObj.foreignApps = foreignApps
        }
        if (appObj.boxes.length + (appObj.accounts?.length || 0) + appObj.foreignApps.length > 8) {
          const nextStart = boxesStart + 8 - ((appObj.accounts?.length || 0) + appObj.foreignApps.length)
          console.log(nextStart)
          appObj.boxes = appObj.boxes.slice(boxesStart, nextStart)
          boxesStart = nextStart
        }
        console.log(appObj.boxes, appObj.foreignApps, appObj.accounts)
      }
    }
    const txns = this.objs.map(this._getTxn)
    return txns
  }


  async simulateTxn (algosdk: typeof _algosdk, algodClient: _algosdk.Algodv2) {
    const txns = this.objs.map(this._getTxn)
    console.log(txns)
    const txngroup = algosdk.assignGroupID(txns);
    // Sign the transaction
    const stxns = txns.map(algosdk.encodeUnsignedSimulateTransaction)
    // Construct the simulation request
    const request = new algosdk.modelsv2.SimulateRequest({
      txnGroups: [
        new algosdk.modelsv2.SimulateRequestTransactionGroup({
          //@ts-ignore
          txns: stxns.map(algosdk.decodeObj),
        }),
      ],
      allowUnnamedResources: true,
      allowEmptySignatures: true,
    });

    // Simulate the transaction group
    const response = await algodClient
      .simulateTransactions(request)
      .do();

    console.log(txns, stxns, response)
    return response
  }

  async getFutureAppId (algosdk: typeof _algosdk, algodClient: _algosdk.Algodv2) {
    const results = await this.simulateTxn(algosdk, algodClient)
    if (results?.txnGroups[0]?.failureMessage) {
      throw {
        code: SIMULATION_ERROR,
        message: results?.txnGroups[0]?.failureMessage
      }
    }
    return results.txnGroups[0].txnResults[0].txnResult.applicationIndex
  }

  _getTxn (obj: TransactionObject) {
    switch (obj.type) {
      case TransactionType.appl:
        //@ts-ignore
        if ((obj as AppObject).appIndex) {
          return _algosdk.makeApplicationCallTxnFromObject(obj as AppCallObject)
        } else if ((obj as AppObject).onComplete === OnApplicationComplete.DeleteApplicationOC) {
          return _algosdk.makeApplicationDeleteTxnFromObject(obj as AppDeleteObject)
        } else {
          return _algosdk.makeApplicationCreateTxnFromObject(obj as AppCreateObject)
        }
      case TransactionType.pay:
        return _algosdk.makePaymentTxnWithSuggestedParamsFromObject(obj as PaymentObject)
      case TransactionType.axfer:
        return _algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(obj as TransfertObject)
      default:
        throw {
          message: `transaction type ${obj.type} not implemented`
        }
    }
  }
}
