import {CONTRACT_TYPE, CONVENTION_TYPE, TRANSACTION_TYPE} from "@/constants";
import {VoiArc72SaleBuy, VoiArc72SaleCreate} from "@/lib/contracts/VoiArc72/VoiArc72Sale";
import {Arc200Arc72SaleBuy, Arc200Arc72SaleCreate} from "@/lib/contracts/Arc200Arc72/Arc200Arc72Sale";
import {Arc200Arc72DutchBuy, Arc200Arc72DutchCreate} from "@/lib/contracts/Arc200Arc72/Arc200Arc72Dutch";
import {VoiArc72DutchBuy, VoiArc72DutchCreate} from "@/lib/contracts/VoiArc72/VoiArc72Dutch";
import {Arc200RwaSaleBuy, Arc200RwaSaleCreate} from "@/lib/contracts/Arc200Rwa/Arc200RwaSale";
import {VoiRwaSaleBuy, VoiRwaSaleCreate} from "@/lib/contracts/VoiRwa/VoiRwaSale";
import {VoiArc72AuctionBid, VoiArc72AuctionCreate} from "@/lib/contracts/VoiArc72/VoiArc72Auction";
import {cancelListing} from "@/lib/contracts/cancelListing";
import {updateListing} from "@/lib/contracts/updateListing";
import {Arc200Arc72AuctionBid, Arc200Arc72AuctionCreate} from "@/lib/contracts/Arc200Arc72/Arc200Arc72Auction";
import {closeListing} from "@/lib/contracts/closeListing";

export function getTransactionFunction (
    transactionType: TRANSACTION_TYPE,
    conventionType: CONVENTION_TYPE,
    contractType: CONTRACT_TYPE){
    switch (transactionType){
        case TRANSACTION_TYPE.buy:
            switch (conventionType) {
                case CONVENTION_TYPE.Arc200Arc72:
                    switch (contractType){
                        case CONTRACT_TYPE.Sale:
                            return Arc200Arc72SaleBuy
                        case CONTRACT_TYPE.Dutch:
                            return Arc200Arc72DutchBuy
                    }
                    break
                case CONVENTION_TYPE.Arc200Rwa:
                    switch (contractType){
                        case CONTRACT_TYPE.Sale:
                            return Arc200RwaSaleBuy
                    }
                    break
                case CONVENTION_TYPE.VoiArc72:
                    switch (contractType){
                        case CONTRACT_TYPE.Sale:
                            return VoiArc72SaleBuy
                        case CONTRACT_TYPE.Dutch:
                            return VoiArc72DutchBuy
                    }
                    break
                case CONVENTION_TYPE.VoiRwa:
                    switch (contractType){
                        case CONTRACT_TYPE.Sale:
                            return VoiRwaSaleBuy
                    }
                    break
                default:
                    throw {
                        message: `Unkown convention type ${conventionType}`
                    }
            }
            break
        case TRANSACTION_TYPE.bid:
            switch (conventionType) {
                case CONVENTION_TYPE.Arc200Arc72:
                    return Arc200Arc72AuctionBid
                case CONVENTION_TYPE.VoiArc72:
                    return VoiArc72AuctionBid
                default:
                    throw {
                        message: `Unkown convention type ${conventionType}`
                    }
            }
        case TRANSACTION_TYPE.create:
            switch (conventionType) {
                case CONVENTION_TYPE.Arc200Arc72:
                    switch (contractType){
                        case CONTRACT_TYPE.Sale:
                            return Arc200Arc72SaleCreate
                        case CONTRACT_TYPE.Dutch:
                            return Arc200Arc72DutchCreate
                        case CONTRACT_TYPE.Auction:
                            return Arc200Arc72AuctionCreate
                        default:
                            throw {
                                message: `Unkown contract type ${contractType}`
                            }
                    }
                case CONVENTION_TYPE.Arc200Rwa:
                    switch (contractType){
                        case CONTRACT_TYPE.Sale:
                            return Arc200RwaSaleCreate
                        default:
                            throw {
                                message: `Unkown contract type ${contractType}`
                            }
                    }
                case CONVENTION_TYPE.VoiArc72:
                    switch (contractType){
                        case CONTRACT_TYPE.Sale:
                            return VoiArc72SaleCreate
                        case CONTRACT_TYPE.Dutch:
                            return VoiArc72DutchCreate
                        case CONTRACT_TYPE.Auction:
                            return VoiArc72AuctionCreate
                        default:
                            throw {
                                message: `Unkown contract type ${contractType}`
                            }
                    }
                case CONVENTION_TYPE.VoiRwa:
                    switch (contractType){
                        case CONTRACT_TYPE.Sale:
                            return VoiRwaSaleCreate
                        default:
                            throw {
                                message: `Unkown contract type ${contractType}`
                            }
                    }
                default:
                    throw {
                        message: `Unkown convention type ${conventionType}`
                    }
            }
        case TRANSACTION_TYPE.cancel:
            return cancelListing
        case TRANSACTION_TYPE.close:
            return closeListing
        case TRANSACTION_TYPE.update:
            return updateListing
        default:
            throw {
                message: `Unkown transaction type ${transactionType}`
            }
    }
}
