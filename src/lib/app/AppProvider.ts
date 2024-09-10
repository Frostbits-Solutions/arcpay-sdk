import {type App, type Ref, ref} from 'vue'

interface AppProviderArgs {
    [key: string]: any
}

interface AppProviderCallback {
    (...args: any[]): void
}

interface AppProviderProvider {
    [key: string]: Ref<{
        args: AppProviderArgs,
        callback: AppProviderCallback
    }> | {
        args: AppProviderArgs,
        callback: AppProviderCallback
    }
}

export class AppProvider {
    private readonly _app: App
    private readonly _provider: AppProviderProvider

    constructor(app: App) {
        this._app = app
        this._provider = {}
        this._app.provide('appProvider', this._provider)
    }

    provide(key: string, args: AppProviderArgs, callback: AppProviderCallback, reactive: boolean = false) {
        if (reactive) {
            if (!this._provider[key]) this._provider[key] = ref({args, callback})
            else {
                const provider = this._provider[key] as Ref<{ args: AppProviderArgs, callback: AppProviderCallback }>
                provider.value = {args, callback}
            }
        } else {
            this._provider[key] = {args, callback}
        }
    }
}