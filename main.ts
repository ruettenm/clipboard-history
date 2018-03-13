import { BrowserWindow, Menu, Tray, app, ipcMain, globalShortcut } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { keyTap } from 'robotjs'

const args = process.argv.slice(1)
const serve = args.some(val => val === '--serve')
let mainWindow: BrowserWindow | null
let tray: Tray

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

        if (pasteClipboard) {
            waitUntilWindowIsHidden()
                .then(() => {
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

    globalShortcut.register('CmdOrCtrl+Shift+v', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                hideWindow()
            } else {
                mainWindow.show()
            }
        }
    })

    if (process.platform === 'darwin') {
        tray = new Tray(path.join(__dirname, 'assets/images', 'icon-mac@2x.png'))
    } else if (process.platform === 'linux') {
        tray = new Tray(path.join(__dirname, 'assets/images', 'icon@2x.png'))
    } else {
        tray = new Tray(path.join(__dirname, 'assets/images', 'icon.png'))
    }

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

    tray.setToolTip('Clipboard History')
    tray.setContextMenu(contextMenu)

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
        console.log(pasteClipboard)
        hideWindow(pasteClipboard)
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
