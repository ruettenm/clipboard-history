import { Injectable } from '@angular/core'
import { NgbModal, NgbModalOptions  } from '@ng-bootstrap/ng-bootstrap'

import { HelpModalContentComponent } from '../components/modal/help-modal-content.component'
import { SettingsModalContentComponent } from '../components/modal/settings-modal-content.component'

const MODAL_OPTIONS: NgbModalOptions = {
    size: 'lg',
    windowClass: 'ch-modal'
}

@Injectable()
export class ModalService {
    constructor(private modalService: NgbModal) {}

    public openHelpModal() {
        this.modalService.open(HelpModalContentComponent, MODAL_OPTIONS)
    }

    public openSettingsModal() {
        this.modalService.open(SettingsModalContentComponent, MODAL_OPTIONS)
    }
}
