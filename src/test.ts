import {useModalsStore} from "@/stores/modalsStore";
import {useParametersStore} from "@/stores/parametersStore";
import {useWalletStore} from "@/stores/walletStore";
import {useTransactionStore} from "@/stores/transactionStore";
import {CONTRACT_TYPE, CONVENTION_TYPE, TRANSACTION_TYPE} from "@/constants";
import {routerListenStores} from "@/router";

const transactionType = TRANSACTION_TYPE.create
const contractType = CONTRACT_TYPE.Auction
const conventionType = CONVENTION_TYPE.Arc200Arc72

const parameters = {
    [TRANSACTION_TYPE.buy]: {
        seller: '6J4RO7U2WYQWOGWXQOZUTBBA46W4QSFL5HTHJWC5BZR53RSYRAOPAY7KPM',
        appIndex: 42037609,
        nftAppID: 29105406,
        arc200AppID:40427782,
        price: 2,
        nftID: 602,
    },
    [TRANSACTION_TYPE.bid]: {
        seller: 'UVGMQYP246NIXHWFSLBNPFVXJ77HSXNLU3AFP3JQEUVJSTGZIMGJ3JFFZY',
        appIndex: 42034657,
        nftAppID: 29105406,
        minPrice: 1,
        nftID: 685,
    },
    [TRANSACTION_TYPE.cancel]: {
        appIndex: 40427317,
        nftAppID: 29105406,
    },
    [TRANSACTION_TYPE.create]: {
        nftAppID: 29105406,
        nftID: 602,
        arc200AppID: 40427782,
        priceMin: 1,
        duration: 1,
    },
    [TRANSACTION_TYPE.update]: {
        appIndex: 42037609,
    },
}

export function test() {
    const modals = useModalsStore()
    modals.showModal('root')
    const params = useParametersStore()

    const walletStore = useWalletStore()
    const transactionStore = useTransactionStore()
    // @ts-ignore
    transactionStore.walletStore = walletStore
    // @ts-ignore
    transactionStore.parameterStore = params
    transactionStore.transactionType = transactionType
    transactionStore.contractType = contractType
    transactionStore.conventionType = conventionType

    params.$patch(parameters[transactionType])
    console.log(params)
    routerListenStores()
}
