import { app, BrowserWindow, screen } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

//
function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay() // 获取主显示器信息
  const { width } = primaryDisplay.workAreaSize // 获取主显示器工作区的宽高
  const winWidth = 400
  const winHeight = 300

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    x: width - winWidth,
    y: 0,
    width: winWidth,
    height: winHeight,
    alwaysOnTop: true,
  })

  win.setAlwaysOnTop(true, 'screen-saver')

  win.on('focus', () => {
    win!.setOpacity(1)
    win!.setIgnoreMouseEvents(false)
  })

  win.on('blur', () => {
    win!.setOpacity(0.2)
    win!.setIgnoreMouseEvents(true, { forward: true })
  })

  // win.webContents.openDevTools()

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow()

  let lastInputTime: number = Date.now()
  let lastMousePosition = screen.getCursorScreenPoint() // 获取鼠标初始位置
  // 定期检查鼠标是否移动
  setInterval(() => {
    const currentMousePosition = screen.getCursorScreenPoint()

    // 检测鼠标是否移动
    if (
      Math.abs(currentMousePosition.x - lastMousePosition.x) > 200 ||
      Math.abs(currentMousePosition.y - lastMousePosition.y) > 200
    ) {
      lastInputTime = Date.now()
      console.log('Mouse movement detected')
      // 发送活跃状态给窗口
      // win?.webContents.send('mouse-status', 'active')

      lastMousePosition = currentMousePosition
    }

    // 检查是否超过5秒无输入
    const now = Date.now()
    if (now - lastInputTime > 2 * 60 * 1000) {
      console.log('No input detected for 5 seconds')
      win?.webContents.send('mouse-inactive', true)
    }
  }, 1000)
})
