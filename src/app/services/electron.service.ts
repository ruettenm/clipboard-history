import { Injectable } from '@angular/core'

import { ipcRenderer } from 'electron'
import * as childProcess from 'child_process'

import { Environment } from '../common/Environment'

@Injectable()
export class ElectronService {
    ipcRenderer: typeof ipcRenderer
    childProcess: typeof childProcess

    constructor() {
        if (Environment.isElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer
            this.childProcess = window.require('child_process')
        }
    }

    public hideWindow(pasteClipboard = false) {
        this.ipcRenderer.send('hideWindow', pasteClipboard)
    }
}
