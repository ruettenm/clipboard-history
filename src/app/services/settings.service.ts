import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { ElectronService } from './electron.service'

export interface ClipboardHistorySettings {
    shortcut: string
    theme: 'dark' | 'light'
    language: 'de' | 'en'
    showTray: boolean
    hideAppWithEsc: boolean
    pasteClipboard: boolean
    startOnLogin: boolean
    detectImages: boolean
}

const DEFAULT_SETTINGS: ClipboardHistorySettings = {
    shortcut: 'CmdOrCtrl+Shift+v',
    theme: 'light',
    language: 'de',
    showTray: true,
    hideAppWithEsc: true,
    pasteClipboard: true,
    startOnLogin: true,
    detectImages: true
}

@Injectable()
export class SettingsService {
    private _settings: BehaviorSubject<ClipboardHistorySettings> = new BehaviorSubject(Object.freeze(DEFAULT_SETTINGS))

    public readonly settings: Observable<ClipboardHistorySettings> = this._settings.asObservable()

    constructor(private electronService: ElectronService) {
        const settings = electronService.getSettings()
        if (settings) {
            this._settings.next(Object.assign({}, settings))
        }
    }

    public restoreDefaults() {
        this.saveSettings(DEFAULT_SETTINGS)
    }

    public saveSettings(settings: ClipboardHistorySettings) {
        const immutableSettings = Object.assign({}, settings)

        this._settings.next(immutableSettings)
        this.electronService.setSettings(immutableSettings)
    }
}
