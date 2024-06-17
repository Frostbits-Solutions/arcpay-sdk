export type PublicNetwork = keyof typeof networkConfig

export const networkConfig = {
  'voi:testnet': {
    network: 'voi:testnet',
    blockchainId: 'algorand:IXnoWtviVVJW5LGivNFc0Dq14V3kqaXu',
    nodeBaseURL: 'https://testnet-api.voi.nodly.io/',
    nodeToken: '',
    nodePort: 443
  },
  'voi:mainnet': {
    network: 'voi:mainnet',
    blockchainId: 'algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k',
    nodeBaseURL: 'https://testnet-api.voi.nodly.io/',
    nodeToken: '',
    nodePort: 443
  }
}