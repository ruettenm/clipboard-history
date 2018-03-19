export interface ClipboardHistorySettings {
    shortcut: string
    theme: 'dark' | 'light'
    language: 'de' | 'en'
    showTray: boolean
    maxEntries: number
    hideAppWithEsc: boolean
    pasteClipboard: boolean
    startOnLogin: boolean
    detectImages: boolean
}

export const DEFAULT_SETTINGS: ClipboardHistorySettings = {
    shortcut: 'CmdOrCtrl+Shift+v',
    theme: 'light',
    language: 'de',
    showTray: true,
    maxEntries: 10,
    hideAppWithEsc: true,
    pasteClipboard: true,
    startOnLogin: true,
    detectImages: true
}
