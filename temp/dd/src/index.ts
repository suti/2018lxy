import * as Electron from 'electron'
import BrowserWindow = Electron.BrowserWindow
import Menu = Electron.Menu
import MenuItem = Electron.MenuItem
import Dialog = Electron.Dialog

import * as path from 'path'
import * as fs from 'fs'
import axios from 'axios'

const deepcopy = require('deepcopy')
const {ipcMain: ipc, app} = Electron
const dialog: Dialog = Electron.dialog

const menu: Menu = new Menu()

menu.append(new MenuItem({label: '复制', role: 'copy'}))
menu.append(new MenuItem({label: '粘贴', role: 'paste'}))
menu.append(new MenuItem({label: '不保留格式粘贴', role: 'pasteandmatchstyle'}))
menu.append(new MenuItem({type: 'separator'})) //线
menu.append(new MenuItem({label: '切换全屏', role: 'togglefullscreen'}))
menu.append(new MenuItem({type: 'separator'})) //线
menu.append(new MenuItem({label: '重新加载', role: 'reload'}))
menu.append(new MenuItem({label: '强制重新加载', role: 'forcereload'}))
menu.append(new MenuItem({label: '检查', role: 'toggledevtools'}))

app.on('browser-window-created', (event: any, win: any) => {
  win.webContents.on('context-menu', (e: any, params: any) => {
    menu.popup(win, {x: params.x, y: params.y})
  })
})

//允许证书验证不通过时加载页面
// app.on('certificate-error',
//   (event, webContents, url, error, certificate, callback) => {
//     console.log(event)
//     event.preventDefault()
//     callback(true)
// })

ipc.on('show-context-menu', (event: any) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})

let host: string = 'www.chuangkit.com'
let userAgent: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Electron/1.7.9 Safari/537.36 Chuangkit/1.0'

let mainWindow: BrowserWindow

function createWindow (): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920, height: 1080, webPreferences: {
      nodeIntegration: false,
    },
  })
  mainWindow.loadURL(`https://${host}/startDesign`, {userAgent})

  mainWindow.webContents.on('new-window',
    (event: any, url: any,) => {
      let win = new BrowserWindow({
        width: 1920, height: 1080, webPreferences: {
          nodeIntegration: false,
        },
      })
      win.loadURL(url, {userAgent})
      event.preventDefault()
    })

  let flagPath = ''

  mainWindow.webContents.session.on('will-download',
    (event, item) => {
      let totalBytes = item.getTotalBytes()
      console.log('1::', flagPath)
      if (flagPath !== '') {
        item.setSavePath(flagPath)
        flagPath = ''
      } else {
        let filePath = path.join(app.getPath('downloads'), item.getFilename())
        let itemUrl = item.getURL()
        dialog.showSaveDialog(mainWindow, {
          title: item.getFilename(),
          defaultPath: filePath,
          filters: [
            {name: '图片', extensions: ['jpg', 'png', 'gif']},
            {name: '文档', extensions: ['pdf', 'ppt']},
            {name: '所有类型', extensions: ['*']},
          ],
        }, (filenames) => {
          flagPath = filenames
          mainWindow.webContents.downloadURL(itemUrl)
          console.log('2::', itemUrl)
        })
        event.preventDefault()
      }
    })

  // mainWindow.webContents.on('did-navigate-in-page',
  //   (event: any, url: any,) => {
  //     if (/^(http:\/\/|https:\/\/)/.test(url)) {
  //       if (testUrl(url).host !== host) {
  //         let win = new BrowserWindow({
  //           width: 1920, height: 1080, webPreferences: {
  //             nodeIntegration: false,
  //           },
  //         })
  //         win.loadURL(url, {userAgent})
  //         event.preventDefault()
  //       }
  //     }
  //   })
  mainWindow.on('close', (event: any) => {
    mainWindow.webContents.executeJavaScript('\
      window.ChuangkitOPT="close";\
    ')
  })
  mainWindow.webContents.on('will-navigate', (event: any) => {
    mainWindow.webContents.executeJavaScript('\
      window.ChuangkitOPT="reload";\
    ')
  })
}

function testUrl (url1: string): { fullPath: string, scheme: string, host: string } {
  let url: string[] = url1.split('//')
  let fullPath: string = url.join('')
  let scheme: string = url[0].split(':')[0]
  let host: string = url[1].split('/')[0]

  return {fullPath, scheme, host}
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
