import { Component, HostListener } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

import { Environment } from './common/Environment'
import { ModalService } from './services/modal.service'
import { ElectronService } from './services/electron.service'
import { SettingsService } from './services/settings.service'

enum KEY_CODE {
    ESCAPE = 27
}

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: [ 'app.component.scss' ]
})
export class AppComponent {
    constructor(
        translate: TranslateService,
        private modalService: ModalService,
        private electronService: ElectronService,
        settingsService: SettingsService) {

        console.log(settingsService.settings)
        translate.setDefaultLang('en')

        if (Environment.isElectron()) {
            console.log('Mode electron')
        } else {
            console.log('Mode web')
        }
    }

    @HostListener('window:keyup', [ '$event' ])
    keyEvent(event: KeyboardEvent) {
        if (event.keyCode === KEY_CODE.ESCAPE) {
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
