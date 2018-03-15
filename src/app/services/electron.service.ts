import { Injectable } from '@angular/core'
import { ipcRenderer } from 'electron'

import { Environment } from '../common/Environment'
import { ClipboardHistorySettings } from './settings.service'

@Injectable()
export class ElectronService {
    private ipcRenderer: typeof ipcRenderer

    constructor() {
        if (Environment.isElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer
        }
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
