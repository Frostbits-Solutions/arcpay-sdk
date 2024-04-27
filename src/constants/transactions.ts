import {
  Arc200Arc72DutchBuyTransaction,
  Arc200Arc72DutchCancelTransaction,
  Arc200Arc72DutchCreateTransaction,
  Arc200Arc72DutchUpdateTransaction,
  Arc200Arc72SaleBuyTransaction,
  Arc200Arc72SaleCancelTransaction,
  Arc200Arc72SaleCreateTransaction,
  Arc200Arc72SaleUpdateTransaction,
  Arc200RwaSaleBuyTransaction,
  Arc200RwaSaleCancelTransaction,
  Arc200RwaSaleCreateTransaction, Arc200RwaSaleUpdateTransaction,
  VoiArc72AuctionBidTransaction,
  VoiArc72AuctionCancelTransaction,
  VoiArc72AuctionCreateTransaction,
  VoiArc72DutchBuyTransaction,
  VoiArc72DutchCancelTransaction,
  VoiArc72DutchCreateTransaction,
  VoiArc72DutchUpdateTransaction,
  VoiArc72SaleBuyTransaction,
  VoiArc72SaleCancelTransaction,
  VoiArc72SaleCreateTransaction,
  VoiArc72SaleUpdateTransaction,
  VoiRwaSaleBuyTransaction,
  VoiRwaSaleCancelTransaction,
  VoiRwaSaleCreateTransaction,
  VoiRwaSaleUpdateTransaction
} from './TransactionButtons'

export enum TRANSACTION_TYPE {
  buy,
  create,
  cancel,
  update,
  bid
}

export enum CONVENTION_TYPE {
  VoiArc72,
  Arc200Arc72,
  VoiRwa,
  Arc200Rwa
}

export enum CONTRACT_TYPE {
  Auction,
  Sale,
  Dutch
}

export const TRANSACTIONS_STEPS = {
  [TRANSACTION_TYPE.buy]: [
    'Initiating purchase transaction, awaiting signature',
    'Processing purchase transaction',
    'Transaction complete, asset acquired'
  ],
  [TRANSACTION_TYPE.bid]: [
    'Initiating bid transaction, awaiting signature',
    'Processing bid transaction',
    'Transaction complete, bid successful'
  ],
  [TRANSACTION_TYPE.create]: [
    'Initiating listing creation, awaiting signature',
    'Transmitting listing data',
    'Allocating funds for listing, awaiting signature',
    'Processing listing funding',
    'Listing creation successful'
  ],
  [TRANSACTION_TYPE.cancel]: [
    'Initiating cancellation transaction, awaiting signature',
    'Processing cancellation request',
    'Cancellation complete, listing removed'
  ],
  [TRANSACTION_TYPE.update]: [
    'Enter new listing price', //This may be irrelevant because price is entered before clicking the button
    'Initiating price update, awaiting signature',
    'Processing price update transaction',
    'Price update successful, listing modified'
  ],
}

export const TRANSACTIONS_BUTTONS = {
  [CONVENTION_TYPE.VoiArc72]: {
    [CONTRACT_TYPE.Sale]: {
      [TRANSACTION_TYPE.buy]: VoiArc72SaleBuyTransaction,
      [TRANSACTION_TYPE.cancel]: VoiArc72SaleCancelTransaction,
      [TRANSACTION_TYPE.create]: VoiArc72SaleCreateTransaction,
      [TRANSACTION_TYPE.update]: VoiArc72SaleUpdateTransaction,
    },
    [CONTRACT_TYPE.Dutch]: {
      [TRANSACTION_TYPE.buy]: VoiArc72DutchBuyTransaction,
      [TRANSACTION_TYPE.cancel]: VoiArc72DutchCancelTransaction,
      [TRANSACTION_TYPE.create]: VoiArc72DutchCreateTransaction,
      [TRANSACTION_TYPE.update]: VoiArc72DutchUpdateTransaction,
    },
    [CONTRACT_TYPE.Auction]: {
      [TRANSACTION_TYPE.bid]: VoiArc72AuctionBidTransaction,
      [TRANSACTION_TYPE.cancel]: VoiArc72AuctionCancelTransaction,
      [TRANSACTION_TYPE.create]: VoiArc72AuctionCreateTransaction,
    }
  },
  [CONVENTION_TYPE.Arc200Arc72]: {
    [CONTRACT_TYPE.Sale]: {
      [TRANSACTION_TYPE.buy]: Arc200Arc72SaleBuyTransaction,
      [TRANSACTION_TYPE.cancel]:Arc200Arc72SaleCancelTransaction,
      [TRANSACTION_TYPE.create]: Arc200Arc72SaleCreateTransaction,
      [TRANSACTION_TYPE.update]: Arc200Arc72SaleUpdateTransaction,
    },
    [CONTRACT_TYPE.Dutch]: {
      [TRANSACTION_TYPE.buy]: Arc200Arc72DutchBuyTransaction,
      [TRANSACTION_TYPE.cancel]: Arc200Arc72DutchCancelTransaction,
      [TRANSACTION_TYPE.create]: Arc200Arc72DutchCreateTransaction,
      [TRANSACTION_TYPE.update]: Arc200Arc72DutchUpdateTransaction,
    },
  },
  [CONVENTION_TYPE.VoiRwa]: {
    [CONTRACT_TYPE.Sale]: {
      [TRANSACTION_TYPE.buy]: VoiRwaSaleBuyTransaction,
      [TRANSACTION_TYPE.cancel]:VoiRwaSaleCancelTransaction,
      [TRANSACTION_TYPE.create]: VoiRwaSaleCreateTransaction,
      [TRANSACTION_TYPE.update]: VoiRwaSaleUpdateTransaction,
    }
  },
  [CONVENTION_TYPE.Arc200Rwa]: {
    [CONTRACT_TYPE.Sale]: {
      [TRANSACTION_TYPE.buy]: Arc200RwaSaleBuyTransaction,
        [TRANSACTION_TYPE.cancel]:Arc200RwaSaleCancelTransaction,
        [TRANSACTION_TYPE.create]: Arc200RwaSaleCreateTransaction,
        [TRANSACTION_TYPE.update]: Arc200RwaSaleUpdateTransaction,
    }
  }
}

export const SIMULATION_ERROR = 4010
