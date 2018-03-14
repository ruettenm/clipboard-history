import { Injectable } from '@angular/core'
import { app } from 'electron'

export interface ClipboardHistorySettings {
    shortcuts: {
        global?: string
        closeApp?: number
    }
    appearance: {
        theme: 'dark' | 'light'
        language: 'de' | 'en'
        showTray: boolean
    }
    general: {
        pasteClipboard: boolean
        startOnLogin: boolean
        detectImages: boolean
    }
}

const DEFAULT_SETTINGS: ClipboardHistorySettings = {
    shortcuts: {
        global: 'CmdOrCtrl+Shift+v',
        closeApp: 27
    },
    appearance: {
        theme: 'light',
        language: 'en',
        showTray: true
    },
    general: {
        pasteClipboard: true,
        startOnLogin: true,
        detectImages: true
    }
}

@Injectable()
export class SettingsService {
    private _settings: ClipboardHistorySettings = DEFAULT_SETTINGS

    constructor() {
        if (app.isReady()) {
            console.log('APP IS READY')
            // if (settings.has('settings')) {
            //     this._settings = settings.get('settings') as any
            // }
        } else {
            console.log('APP IS _NOT_ READY')
        }
    }

    public get settings(): ClipboardHistorySettings {
        return this._settings
    }

    public set settings(settings: ClipboardHistorySettings) {
        this._settings = settings
    }
}
