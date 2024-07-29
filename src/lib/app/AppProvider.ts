import type { App } from 'vue'

interface AppProviderArgs { [key: string]: any }
interface AppProviderCallback { (...args: any[]): void }
interface AppProviderProvider {
  [key: string]: {
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

  provide(key: string, args: AppProviderArgs, callback: AppProviderCallback) {
    this._provider[key] = {args, callback}
  }
}