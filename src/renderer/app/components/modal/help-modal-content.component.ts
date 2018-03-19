import { Component } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ElectronService } from '../../services/electron.service'

@Component({
    selector: 'app-help-modal-content',
    templateUrl: 'help-modal-content.html'
})
export class HelpModalContentComponent {
    constructor(private activeModal: NgbActiveModal, public electronService: ElectronService) {}

    public closeModal() {
        this.activeModal.close()
    }
}
