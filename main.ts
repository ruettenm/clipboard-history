import { BrowserWindow, Menu, Tray, app, screen, ipcMain, globalShortcut } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { keyTap } from 'robotjs'

const args = process.argv.slice(1)
const serve = args.some(val => val === '--serve')
let mainWindow
let tray

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
            if (!mainWindow.isVisible() || tries > maxTries) {
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
                keyTap('v', 'command')
            })
            .catch(err => {
                console.error(err)
            })
    }
}

function createWindow() {
    const electronScreen = screen
    const size = electronScreen.getPrimaryDisplay().workAreaSize

    mainWindow = new BrowserWindow({
        frame: false,
        height: 800,
        width: 600,
        resizable: true,
        center: true,
        skipTaskbar: true,
        show: true,
        title: 'Clipboard History',
        icon: path.join(__dirname, 'assets', 'app_icon.png')
    })

    globalShortcut.register('Cmd+Shift+v', () => {
        if (mainWindow.isVisible()) {
            hideWindow()
        } else {
            mainWindow.show()
        }
    })

    if (process.platform === 'darwin') {
        tray = new Tray(path.join(__dirname, 'assets', 'iconTemplate.png'))
    } else if (process.platform === 'linux') {
        tray = new Tray(path.join(__dirname, 'assets', 'iconHighlight@2x.png'))
    } else {
        tray = new Tray(path.join(__dirname, 'assets', 'iconHighlight.png'))
    }

    const contextMenu = Menu.buildFromTemplate([
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
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }))
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    ipcMain.on('hideWindow', (_, pasteClipboard) => {
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
