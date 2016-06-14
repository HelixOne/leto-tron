const electron = require('electron')
const { app, BrowserWindow, ipcMain} = require('electron')
const request = require('request');

let mainWindow

function createWindow() {
  let displays = electron.screen.getAllDisplays()
  let d = displays.find((display) => {
    return { width: display.bounds.width, height: display.bounds.height }
  })
  let minScreenWidth = 650;
  let minScreenHeight = 450;

  mainWindow = new BrowserWindow({
    width: Math.max(minScreenWidth, ~~(d.bounds.width * 0.75)),
    height: Math.max(minScreenHeight, ~~(d.bounds.height * 0.75)),
    minWidth: minScreenWidth,
    minHeight: minScreenHeight,
    title: 'Leto'
  })
  loadApp()
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

function loadApp() {
  mainWindow.loadURL(`file://${__dirname}/loading.html`)
  request('https://letojs.com/ping', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      mainWindow.loadURL(`https://letojs.com/`)
    } else {
      mainWindow.loadURL(`file://${__dirname}/offline.html`)
    }
  })
}

ipcMain.on('retry', (event, arg) => {
  loadApp()
})
