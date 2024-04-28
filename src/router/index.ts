import {createMemoryHistory, createRouter} from 'vue-router'
import TransactionView from '@/views/TransactionView.vue'
import WalletSelectionView from '@/views/WalletSelectionView.vue'
import AccountSelectionView from '@/views/AccountSelectionView.vue'
import SuccessView from '@/views/SuccessView.vue'
import ErrorView from '@/views/ErrorView.vue'
import {useWalletStore} from "@/stores/walletStore";
import {useTransactionStore} from "@/stores/transactionStore";
import {TRANSACTION_STATE, TRANSACTION_TYPE} from "@/constants";
import BidButton from "@/components/Transaction/BidButton.vue";
import BuyButton from "@/components/Transaction/BuyButton.vue";
import CancelButton from "@/components/Transaction/CancelButton.vue";
import UpdateButton from "@/components/Transaction/UpdateButton.vue";
import CloseButton from "@/components/Transaction/CloseButton.vue";
import CreateButton from "@/components/Transaction/CreateButton.vue";

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
          path: 'close',
          component: CloseButton,
        },
        {
          path: 'update',
          component: UpdateButton,
        },
        {
          path: 'create',
          component: CreateButton,
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
        case TRANSACTION_TYPE.close:
          router.push('/transaction/close')
          break
        case TRANSACTION_TYPE.create:
         router.push('/transaction/create')
          break
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
