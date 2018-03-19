import { Injectable } from '@angular/core'
import { ipcRenderer, shell } from 'electron'

import { Environment } from '../common/Environment'
import { ClipboardHistorySettings } from '../../../shared/settings'

@Injectable()
export class ElectronService {
    private ipcRenderer: typeof ipcRenderer
    private shell: typeof shell

    constructor() {
        if (Environment.isElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer
            this.shell = window.require('electron').shell
        }
    }

    public openExternalLink(url: string) {
        this.shell.openExternal(url)
    }

    public hideWindow(pasteClipboard = false) {
        this.ipcRenderer.send('hideWindow', pasteClipboard)
    }

    public getSettings(): ClipboardHistorySettings {
        return this.ipcRenderer.sendSync('getSettings')
    }

    public setSettings(settings: ClipboardHistorySettings) {
        this.ipcRenderer.send('setSettings', settings)
    }
}
