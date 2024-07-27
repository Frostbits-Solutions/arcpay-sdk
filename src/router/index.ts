import {createMemoryHistory, createRouter} from 'vue-router'
import WalletSelectionView from '@/views/WalletSelectionView.vue'
import ModalView from '@/views/ModalView.vue'
import TestView from '@/views/TestView.vue'
import ListingCreationView from '@/views/ListingCreationView.vue'
import SaleCreation from '@/components/ListingCreation/SaleCreation.vue'
import AuctionCreation from '@/components/ListingCreation/AuctionCreation.vue'
import DutchCreation from '@/components/ListingCreation/DutchCreation.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      component: TestView
    },
    {
      path: '/modal',
      component: ModalView,
      children: [
        {
          path: '/wallet',
          name: 'wallet-selection',
          component: WalletSelectionView,
          meta: {
            title: 'Connect wallet',
            description: 'Select an account to connect to the application',
          }
        },
        {
          path: '/create',
          name: 'listing-creation',
          component: ListingCreationView,
          meta: {
            title: 'Create listing',
            description: 'Create a new listing for digital and real-world assets',
          },
          redirect: {name: 'sale-creation'},
          children: [
            {
              path: '/sale',
              name: 'sale-creation',
              component: SaleCreation
            },
            {
              path: '/auction',
              name: 'auction-creation',
              component: AuctionCreation
            },
            {
              path: '/dutch',
              name: 'dutch-creation',
              component: DutchCreation
            }
          ]
        }
      ]
    }
  ]
})
export default router
