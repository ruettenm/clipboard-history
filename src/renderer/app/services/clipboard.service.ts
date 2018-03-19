import { Injectable } from '@angular/core'
import { NativeImage, clipboard } from 'electron'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import { List } from 'immutable'

import { Environment } from '../common/Environment'
import { ElectronService } from './electron.service'
import { SettingsService } from './settings.service'
import { ClipboardHistorySettings } from '../../../shared/settings'

const POLL_INTERVAL_IN_MS = 1000

export interface ClipboardEntry {
    text?: {
        value: string
    }
    image?: {
        value: NativeImage
    }
}

@Injectable()
export class ClipboardService {
    private clipboard: typeof clipboard
    private lastClipboardEntry: ClipboardEntry = { }
    private _history: BehaviorSubject<List<ClipboardEntry>> = new BehaviorSubject(List([]))
    private maxEntries: number
    private detectImages: boolean

    public readonly history: Observable<List<ClipboardEntry>> = this._history.asObservable()

    public get clipboardLength() {
        return this._history.getValue().size
    }

    constructor(private electronService: ElectronService, settingsService: SettingsService) {
        if (Environment.isElectron()) {
            this.clipboard = window.require('electron').clipboard
        }

        settingsService.settings.subscribe((settings: ClipboardHistorySettings) => {
            this.maxEntries = settings.maxEntries
            this.detectImages = settings.detectImages
        })

        this.pollForChanges()
    }

    public pasteToClipboardByIndex(entryIndex: number) {
        this.pasteToClipboard(this.entryByIndex(entryIndex))
    }

    public pasteToClipboard(entry: ClipboardEntry) {
        this.moveToTop(entry)

        if (entry.text) {
            this.pasteTextToClipboard(entry.text.value)
        } else if (entry.image) {
            this.pasteImageToClipboard(entry.image.value)
        }

        this.electronService.hideWindow(true)
    }

    private pollForChanges() {
        setInterval(() => {
            const clipboardText = this.clipboard.readText()
            const clipboardImage = this.clipboard.readImage()

            if (this.isNewTextEntry(clipboardText)) {
                this.insertEntry({
                    text: {
                        value: clipboardText
                    }
                })
            } else if (this.detectImages && this.isNewImageEntry(clipboardImage)) {
                this.insertEntry({
                    image: {
                        value: clipboardImage
                    }
                })
            }
        }, POLL_INTERVAL_IN_MS)
    }

    private moveToTop(entry: ClipboardEntry) {
        const indexOfEntry = this._history.getValue().indexOf(entry)

        this.lastClipboardEntry = entry
        this._history.next(
            this._history
                .getValue()
                .remove(indexOfEntry)
                .insert(0, entry)
        )
    }

    private isNewImageEntry(clipboardImage: Electron.NativeImage) {
        const { image } = this.lastClipboardEntry

        return !clipboardImage.isEmpty() && !image || image && image.value.toDataURL() !== clipboardImage.toDataURL()
    }

    private isNewTextEntry(value: string) {
        const { text } = this.lastClipboardEntry

        return value.length > 0 && (!text || text && text.value !== value)
    }

    private entryByIndex(index: number) {
        return this._history.getValue().get(index)
    }

    private insertEntry(entry: ClipboardEntry) {
        this.lastClipboardEntry = entry

        const currentList = this._history.getValue()
        const maxLength = this.maxEntries - 1
        const shortenedList = currentList.size > maxLength ? currentList.setSize(maxLength) : currentList
        this._history.next(shortenedList.insert(0, entry))
    }

    private pasteTextToClipboard(value: string) {
        this.clipboard.writeText(value)
    }

    private pasteImageToClipboard(value: NativeImage) {
        this.clipboard.writeImage(value)
    }
}
