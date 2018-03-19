import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { ElectronService } from './electron.service'
import { ClipboardHistorySettings, DEFAULT_SETTINGS } from '../../../shared/settings'

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
