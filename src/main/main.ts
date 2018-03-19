import { BrowserWindow, Menu, Tray, app, ipcMain, globalShortcut } from 'electron'
import * as path from 'path'
import * as url from 'url'
import * as electronSettings from 'electron-settings'
import { keyTap } from 'robotjs'
import Event = Electron.Event
import { ClipboardHistorySettings, DEFAULT_SETTINGS } from '../shared/settings'

const args = process.argv.slice(1)
const serve = args.some(val => val === '--serve')
let mainWindow: BrowserWindow | null
let tray: Tray

const contextMenu = Menu.buildFromTemplate([
    {
        label: 'Open',
        click: () => {
            if (mainWindow) {
                mainWindow.show()
            }
        }
    },
    {
        label: 'Quit',
        click: () => {
            app.quit()
        }
    }
])

try {
    require('dotenv').config()
} catch {
    console.log('asar')
}

function waitUntilWindowIsHidden() {
    return new Promise((resolve, reject) => {
        let tries = 1
        const maxTries = 10
        const interval = setInterval(() => {
            if (mainWindow && !mainWindow.isVisible() || tries > maxTries) {
                tries++
                clearInterval(interval)
                if (tries > maxTries) {
                    reject('main window is still open')
                } else {
                    resolve()
                }
            }
        }, 5)
    })
}

function hideWindow(pasteClipboard = false) {
    if (mainWindow) {
        if (app.hide) {
            // Linux and MacOS
            app.hide()
        } else {
            // for Windows
            mainWindow.blur()
            mainWindow.hide()
        }

        if (getSettings().pasteClipboard && pasteClipboard) {
            waitUntilWindowIsHidden().then(() => {
                if (process.platform === 'darwin') {
                    keyTap('v', 'command')
                } else {
                    keyTap('v', 'control')
                }
            })
            .catch(err => {
                console.error(err)
            })
        }
    }
}

function getSettings(): ClipboardHistorySettings {
    return electronSettings.get('settings') as any || DEFAULT_SETTINGS
}

function updateStartOnLoginConfiguration(startOnLogin: boolean) {
    app.setLoginItemSettings({
        openAtLogin: startOnLogin,
        openAsHidden: true
    })
}

function updateGlobalShortcut(shortcut: string) {
    globalShortcut.unregisterAll()
    globalShortcut.register(shortcut, () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                hideWindow()
            } else {
                mainWindow.show()
            }
        }
    })
}

function updateTray(showTray: boolean) {
    if (showTray) {
        if (!tray || tray.isDestroyed()) {
            if (process.platform === 'darwin') {
                tray = new Tray(path.join(__dirname, 'assets', 'icon-mac@2x.png'))
            } else if (process.platform === 'linux') {
                tray = new Tray(path.join(__dirname, 'assets', 'icon@2x.png'))
            } else {
                tray = new Tray(path.join(__dirname, 'assets', 'icon.png'))
            }

            tray.setToolTip('Clipboard History')
            tray.setContextMenu(contextMenu)
        }
    } else {
        if (tray && !tray.isDestroyed()) {
            tray.destroy()
        }
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        frame: false,
        height: 800,
        width: 600,
        resizable: true,
        center: true,
        skipTaskbar: true,
        show: true,
        title: 'Clipboard History',
        icon: path.join(__dirname, 'assets', 'icon-512.png')
    })

    const settings = getSettings()
    updateGlobalShortcut(settings.shortcut)
    updateTray(settings.showTray)
    updateStartOnLoginConfiguration(settings.startOnLogin)

    if (serve) {
        require('electron-reload')(__dirname, {})
        mainWindow.loadURL('http://localhost:4200')
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'www/index.html'),
            protocol: 'file:',
            slashes: true
        }))
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    ipcMain.on('hideWindow', (_: Event, pasteClipboard: boolean) => {
        hideWindow(pasteClipboard)
    })

    ipcMain.on('getSettings', (event: Event) => {
        event.returnValue = getSettings()
    })

    ipcMain.on('setSettings', (_: Event, value: any) => {
        updateTray(value.showTray)
        updateGlobalShortcut(value.shortcut)
        updateStartOnLoginConfiguration(value.startOnLogin)
        electronSettings.set('settings', value)
    })
}

try {
    app.on('ready', createWindow)

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow()
        }
    })

} catch (e) {
    // Catch Error
    // throw e;
}
