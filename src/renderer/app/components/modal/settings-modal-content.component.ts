import { Component } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { SettingsService } from '../../services/settings.service'
import { ClipboardHistorySettings } from '../../../../shared/settings'

@Component({
    selector: 'app-settings-modal-content',
    templateUrl: 'settings-modal-content.html'
})
export class SettingsModalContentComponent {
    public formValues: ClipboardHistorySettings

    constructor(private activeModal: NgbActiveModal, private settingsService: SettingsService) {
        this.settingsService.settings.subscribe((settings: ClipboardHistorySettings) => {
            this.formValues = { ...settings }
        })
    }

    public applyChanges() {
        this.settingsService.saveSettings(this.formValues)
        this.closeModal()
    }

    public closeModal() {
        this.activeModal.close()
    }

    public restoreDefaults() {
        this.settingsService.restoreDefaults()
    }
}
