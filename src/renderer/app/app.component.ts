import { Component, HostListener } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

import { ModalService } from './services/modal.service'
import { ElectronService } from './services/electron.service'
import { SettingsService } from './services/settings.service'
import { ClipboardHistorySettings } from '../../shared/settings'

enum KEY_CODE {
    ESCAPE = 27
}

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    private closeAppWithEsc: boolean

    constructor(
        translate: TranslateService,
        private modalService: ModalService,
        private electronService: ElectronService,
        settingsService: SettingsService) {

        translate.setDefaultLang('en')
        settingsService.settings.subscribe((settings: ClipboardHistorySettings) => {
            translate.use(settings.language)
            this.closeAppWithEsc = settings.hideAppWithEsc
        })
    }

    @HostListener('window:keyup', [ '$event' ])
    public keyEvent(event: KeyboardEvent) {
        if (this.closeAppWithEsc && event.keyCode === KEY_CODE.ESCAPE) {
            this.electronService.hideWindow()
        }
    }

    public showSettings() {
        this.modalService.openSettingsModal()
    }

    public showHelp() {
        this.modalService.openHelpModal()
    }
}
