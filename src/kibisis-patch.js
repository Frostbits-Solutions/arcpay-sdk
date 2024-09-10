import {KibisisWallet} from '@txnlab/use-wallet'

async function _initializeAVMWebProviderSDK() {
    const _functionName = '_initializeAVMWebProviderSDK'

    if (!this.avmWebProviderSDK) {
        console.info(
            `[${KibisisWallet.name}]#${_functionName}: initializing @agoralabs-sh/avm-web-provider...`
        )

        this.avmWebProviderSDK = await import('@agoralabs-sh/avm-web-provider')

        if (!this.avmWebProviderSDK) {
            throw new Error(
                'failed to initialize, the @agoralabs-sh/avm-web-provider sdk was not provided'
            )
        }
    }

    return this.avmWebProviderSDK
}

KibisisWallet.prototype._initializeAVMWebProviderSDK = _initializeAVMWebProviderSDK