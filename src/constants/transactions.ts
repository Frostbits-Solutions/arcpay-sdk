
export const enum TRANSACTION_STATE {
  idle,
  initiatingTransaction,
  signingTransaction,
  sendingTransaction,
  error,
  success,
}

export enum TRANSACTION_TYPE {
  buy,
  create,
  cancel,
  update,
  bid,
  close
}

export enum CURRENCY_TYPE {
  VOI,
  ARC200
}
export enum SELLING_OBJECT_TYPE {
  RWA,
  ARC72
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
  [TRANSACTION_TYPE.close]: [
    'Initiating closing transaction, awaiting signature',
    'Processing closing request',
    'Close complete, listing closed'
  ],
  [TRANSACTION_TYPE.update]: [
    'Enter new listing price', //This may be irrelevant because price is entered before clicking the button
    'Initiating price update, awaiting signature',
    'Processing price update transaction',
    'Price update successful, listing modified'
  ],
}

export const SIMULATION_ERROR = 4010
