/* eslint-disable */
// 'use strict'

import { app, BrowserWindow, globalShortcut } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function setShortcut () {
  /* Alt + s: 打开搜索面板 */
  const ret = globalShortcut.register('Alt+z', () => {
    mainWindow.restore()
  })
}
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 750,
    useContentSize: true,
    width: 300
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', ()=>{
  createWindow()
  setShortcut()
})

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

const ipc =require('electron').ipcMain
//登录窗口最小化
ipc.on('window-min', function () {
  mainWindow.minimize();
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
