import {createMemoryHistory, createRouter} from 'vue-router'
import WalletSelectionView from '@/views/WalletSelectionView.vue'
import ModalView from '@/views/ModalView.vue'
import ListingCreationView from '@/views/ListingCreationView.vue'
import SaleCreation from '@/components/ListingCreation/SaleCreation.vue'
import AuctionCreation from '@/components/ListingCreation/AuctionCreation.vue'
import DutchCreation from '@/components/ListingCreation/DutchCreation.vue'
import LoadingView from '@/views/LoadingView.vue'
import ErrorView from '@/views/ErrorView.vue'
import SuccessView from '@/views/SuccessView.vue'
import ListingReviewView from '@/views/ListingReviewView.vue'
import SaleReview from '@/components/ListingReview/SaleReview.vue'
import IdleView from '@/views/IdleView.vue'
import AuctionReview from "@/components/ListingReview/AuctionReview.vue";
import DutchReview from "@/components/ListingReview/DutchReview.vue";
import OffchainCreation from "@/components/ListingCreation/OffchainCreation.vue";
import OnchainCreation from "@/components/ListingCreation/OnchainCreation.vue";

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        {
            path: '/',
            component: IdleView
        },
        {
            path: '/modal',
            component: ModalView,
            children: [
                {
                    path: '/loading',
                    name: 'loading',
                    component: LoadingView,
                    meta: {
                        closeable: false
                    }
                },
                {
                    path: '/success',
                    name: 'success',
                    component: SuccessView,
                    meta: {
                        closeable: true
                    }
                },
                {
                    path: '/error',
                    name: 'error',
                    component: ErrorView,
                    meta: {
                        closeable: true
                    }
                },
                {
                    path: '/wallet',
                    name: 'wallet-selection',
                    component: WalletSelectionView,
                    meta: {
                        title: 'Connect wallet',
                        description: 'Select an account to connect to the application',
                        closeable: true
                    }
                },
                {
                    path: '/create',
                    name: 'listing-creation',
                    component: ListingCreationView,
                    meta: {
                        title: 'Create listing',
                        closeable: true
                    },
                    redirect: {name: 'sale-creation'},
                    children: [
                        {
                            path: '/onchain',
                            name: 'onchain-creation',
                            meta: {
                                description: 'Create a new digital on-chain asset listing',
                            },
                            component: OnchainCreation,
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
                        },
                        {
                            path: '/offchain',
                            name: 'offchain-creation',
                            component: OffchainCreation,
                            meta: {
                                description: 'Create a new off-chain asset listing',
                            },
                        }
                    ]
                },
                {
                    path: '/review',
                    name: 'listing-review',
                    component: ListingReviewView,
                    meta: {
                        closeable: true
                    },
                    children: [
                        {
                            path: '/sale',
                            name: 'sale-review',
                            component: SaleReview
                        },
                        {
                            path: '/auction',
                            name: 'auction-review',
                            component: AuctionReview
                        },
                        {
                            path: '/dutch',
                            name: 'dutch-review',
                            component: DutchReview
                        }
                    ]
                },
            ]
        }
    ]
})
export default router
