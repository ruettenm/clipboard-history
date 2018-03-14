import { Component } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'app-help-modal-content',
    templateUrl: 'help-modal-content.html'
})
export class HelpModalContentComponent {
    constructor(public activeModal: NgbActiveModal) {}
}
