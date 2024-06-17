import type { PublicNetwork } from './network.config'
import { networkConfig } from './network.config'
import algosdk from 'algosdk'

export class AlgodClient {
  private readonly _client: algosdk.Algodv2
  private readonly _networkConfig: typeof networkConfig[keyof typeof networkConfig]

  protected constructor(network: PublicNetwork) {
    this._networkConfig = networkConfig[network]
    this._client = new algosdk.Algodv2(this._networkConfig.nodeToken, this._networkConfig.nodeBaseURL, this._networkConfig.nodePort)
  }

  get client(): algosdk.Algodv2{
    return this._client
  }

  get config(): typeof networkConfig[keyof typeof networkConfig]{
    return this._networkConfig
  }
}