import { Component } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'app-settings-modal-content',
    templateUrl: 'settings-modal-content.html'
})
export class SettingsModalContentComponent {
    constructor(public activeModal: NgbActiveModal) {}
}
