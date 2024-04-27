import { createRouter, createMemoryHistory } from 'vue-router'
import TransactionView from '@/views/TransactionView.vue'
import WalletSelectionView from '@/views/WalletSelectionView.vue'
import AccountSelectionView from '@/views/AccountSelectionView.vue'
import SuccessView from '@/views/SuccessView.vue'
import ErrorView from '@/views/ErrorView.vue'

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
      component: TransactionView,
      children:[]
    },
  ]
})

export default router
