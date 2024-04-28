import {createMemoryHistory, createRouter} from 'vue-router'
import TransactionView from '@/views/TransactionView.vue'
import WalletSelectionView from '@/views/WalletSelectionView.vue'
import AccountSelectionView from '@/views/AccountSelectionView.vue'
import SuccessView from '@/views/SuccessView.vue'
import ErrorView from '@/views/ErrorView.vue'
import {useWalletStore} from "@/stores/walletStore";
import {useTransactionStore} from "@/stores/transactionStore";
import {CONTRACT_TYPE, TRANSACTION_STATE, TRANSACTION_TYPE} from "@/constants";
import BidButton from "@/components/Transaction/BidButton.vue";
import BuyButton from "@/components/Transaction/BuyButton.vue";
import CancelButton from "@/components/Transaction/CancelButton.vue";
import UpdateButton from "@/components/Transaction/UpdateButton.vue";
import CreateAuctionButton from "@/components/Transaction/CreateAuctionButton.vue";
import CreateDutchButton from "@/components/Transaction/CreateDutchButton.vue";
import CreateSaleButton from "@/components/Transaction/CreateSaleButton.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      name: 'wallet-selection',
      component: WalletSelectionView
    },
    {
      path: '/account',
      name: 'account-selection',
      component: AccountSelectionView
    },
    {
      path: '/success',
      name: 'success',
      component: SuccessView
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorView
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: TransactionView,
      children:[
        {
          path: 'bid',
          component: BidButton,
        },
        {
          path: 'buy',
          component: BuyButton,
        },
        {
          path: 'cancel',
          component: CancelButton,
        },
        {
          path: 'update',
          component: UpdateButton,
        },
        {
          path: 'create/auction',
          component: CreateAuctionButton,
        },
        {
          path: 'create/dutch',
          component: CreateDutchButton,
        },
        {
          path: 'create/sale',
          component: CreateSaleButton,
        },
      ]
    },
  ]
})
export default router

export function routerListenStores () {
  const walletStore = useWalletStore()
  const transactionStore = useTransactionStore()

  walletStore.$subscribe(() => {
    if (walletStore.wallet === null) {
      router.push({name: 'wallet-selection'})
    } else if (walletStore.account === null) {
      router.push({name: 'account-selection'})
    } else {
      switch (transactionStore.transactionType) {
        case TRANSACTION_TYPE.bid:
          router.push('/transaction/bid')
          break
        case TRANSACTION_TYPE.buy:
          router.push('/transaction/buy')
          break
        case TRANSACTION_TYPE.update:
          router.push('/transaction/update')
          break
        case TRANSACTION_TYPE.cancel:
          router.push('/transaction/cancel')
          break
        case TRANSACTION_TYPE.create:
          switch (transactionStore.contractType) {
            case CONTRACT_TYPE.Auction:
              router.push('/transaction/create/auction')
              break
            case CONTRACT_TYPE.Dutch:
              router.push('/transaction/create/dutch')
              break
            case CONTRACT_TYPE.Sale:
              router.push('/transaction/create/sale')
              break
          }
      }
    }
  })

  transactionStore.$subscribe(() => {
    if (transactionStore.state === TRANSACTION_STATE.error) {
      router.push({name: 'error'})
    } else if (transactionStore.state === TRANSACTION_STATE.success) {
      router.push({name: 'success'})
    }
  })
}
