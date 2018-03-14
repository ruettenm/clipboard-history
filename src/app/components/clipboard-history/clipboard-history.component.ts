import { Component, HostListener } from '@angular/core'
import { List } from 'immutable'
import { Observable } from 'rxjs/Observable'

import { ClipboardEntry, ClipboardService } from '../../services/clipboard.service'

enum KEY_CODE {
    UP_ARROW = 38,
    DOWN_ARROW = 40,
    ENTER = 13
}

@Component({
    selector: 'app-clipboard-history',
    templateUrl: './clipboard-history.component.html',
    styleUrls: ['./clipboard-history.component.scss']
})
export class ClipboardHistoryComponent {

    public clipboardHistroy: Observable<List<ClipboardEntry>>

    public selectedEntryIndex = 0

    constructor(private clipboardService: ClipboardService) {
        this.clipboardHistroy = clipboardService.history
    }

    @HostListener('window:keyup', [ '$event' ])
    keyEvent(event: KeyboardEvent) {
        if (event.keyCode === KEY_CODE.UP_ARROW) {
            this.keyArrowUp()
        } else if (event.keyCode === KEY_CODE.DOWN_ARROW) {
            this.keyArrowDown()
        } else if (event.keyCode === KEY_CODE.ENTER) {
            this.keyEnter()
        }
    }

    private keyArrowDown() {
        if (this.selectedEntryIndex === this.clipboardService.clipboardLength - 1) {
            this.selectedEntryIndex = 0
        } else {
            this.selectedEntryIndex++
        }
    }

    private keyArrowUp() {
        if (this.selectedEntryIndex === 0) {
            this.selectedEntryIndex = this.clipboardService.clipboardLength - 1
        } else {
            this.selectedEntryIndex--
        }
    }

    private keyEnter() {
        this.clipboardService.pasteToClipboardByIndex(this.selectedEntryIndex)
        this.selectedEntryIndex = 0
    }

    public selectEntry(entry: ClipboardEntry) {
        this.clipboardService.pasteToClipboard(entry)
        this.selectedEntryIndex = 0
    }
}
