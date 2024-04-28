import { createApp } from 'vue'

export class Modal {
  private readonly _app: ReturnType<typeof createApp>
  private readonly _id: string

  constructor(app: ReturnType<typeof createApp>, id: string) {
    this._app = app
    this._id = id
  }

  public toggleDarkMode() {
    document.getElementById(this._id)?.classList.toggle('ap-dark')
  }

  get id() {
    return this._id
  }
}