const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow
let detachedWindows = {} // 保存分离出的独立窗口实例
let formWindows = {} // 保存新增表单窗口实例

// 初始化数据文件
const dataPath = path.join(app.getPath('userData'), 'coderpro_data.json')
const defaultData = {
  urls: [],
  texts: [],
  tasks: []
}
let globalStore = { ...defaultData } // 内存中的 Source of Truth

function initDataFile() {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true })
  if (!fs.existsSync(dataPath)) {
    writeData(defaultData)
  }
  globalStore = readData()
}

function normalizeData(data) {
  return {
    urls: Array.isArray(data?.urls) ? data.urls : [],
    texts: Array.isArray(data?.texts) ? data.texts : [],
    tasks: Array.isArray(data?.tasks) ? data.tasks : []
  }
}

function readData() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8')
    return normalizeData(JSON.parse(raw))
  } catch (e) {
    return normalizeData(defaultData)
  }
}

function writeData(data) {
  try {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true })
    const normalized = normalizeData(data)
    const tempPath = `${dataPath}.tmp`
    fs.writeFileSync(tempPath, JSON.stringify(normalized, null, 2), 'utf-8')
    fs.renameSync(tempPath, dataPath)
  } catch (e) {
    console.error('Failed to write data:', e)
  }
}

// 创建主悬浮窗
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 80,
    height: 80,
    type: 'toolbar',
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    backgroundColor: '#00000000',
    hasShadow: false,
    thickFrame: false,
    focusable: true,
    paintWhenInitiallyHidden: true,
    skipTaskbar: true,
    maximizable: false,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // 设置窗口为最高层级（Windows）
  mainWindow.setAlwaysOnTop(true, 'screen-saver', 1)
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  // 根据运行环境加载
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }

  // 避免在任务栏显示
  mainWindow.setSkipTaskbar(true)
}

// 创建独立面板
function createDetachedWindow(tabType) {
  if (detachedWindows[tabType]) return // 已存在则不重复创建

  const pos = mainWindow.getBounds()

  const win = new BrowserWindow({
    width: 400,
    height: 500,
    x: pos.x + 100, // 稍微偏移一点
    y: pos.y,
    type: 'toolbar',
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    thickFrame: false,
    skipTaskbar: true,
    paintWhenInitiallyHidden: true,
    focusable: true,
    maximizable: false,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  const hash = `detached-tab?type=${tabType}`
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    win.loadURL(`http://localhost:5173/#/${hash}`)
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'), { hash })
  }

  win.setSkipTaskbar(true)

  // 设置窗口为最高层级
  win.setAlwaysOnTop(true, 'screen-saver', 1)
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  win.on('closed', () => {
    delete detachedWindows[tabType]
    notifyDetachedTabsChange()
  })

  detachedWindows[tabType] = win
  notifyDetachedTabsChange()
}

// 创建新增表单窗口
function createFormWindow(type) {
  if (formWindows[type]) {
    formWindows[type].focus()
    return
  }

  const win = new BrowserWindow({
    width: 350,
    height: 450,
    type: 'toolbar',
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    backgroundColor: '#00000000',
    hasShadow: false,
    thickFrame: false,
    skipTaskbar: true,
    paintWhenInitiallyHidden: true,
    focusable: true,
    maximizable: false,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  const hash = `form-window?type=${type}`
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    win.loadURL(`http://localhost:5173/#/${hash}`)
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'), { hash })
  }

  win.setSkipTaskbar(true)

  // 设置窗口为最高层级
  win.setAlwaysOnTop(true, 'screen-saver', 1)
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  win.on('closed', () => {
    delete formWindows[type]
  })

  formWindows[type] = win
}

// 通知前端已分离的 Tab 列表
function notifyDetachedTabsChange() {
  if (mainWindow) {
    mainWindow.webContents.send('detached-tabs-updated', Object.keys(detachedWindows))
  }
}

app.whenReady().then(() => {
  initDataFile()
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// === IPC 通信处理 ===

// 获取数据
ipcMain.handle('get-data', () => {
  return globalStore
})

// 分类保存数据 (核心修复：防止全量覆盖导致的丢失)
ipcMain.handle('save-data', (event, { category, data }) => {
  if (category && globalStore.hasOwnProperty(category)) {
    globalStore[category] = data
    writeData(globalStore)
    
    // 广播给所有窗口
    BrowserWindow.getAllWindows().forEach(win => {
      if (!win.isDestroyed()) {
        win.webContents.send('data-updated', globalStore)
      }
    })
  }
  return globalStore
})

// 控制主窗口大小 (展开/收起二级菜单)
ipcMain.on('resize-main-window', (event, { width, height }) => {
  if (mainWindow) {
    // 使用 setSize 并触发动画
    mainWindow.setSize(width, height, true)
    // 强制重绘：先清除再设置
    mainWindow.setContentSize(width, height)
    // 通知渲染进程窗口已调整
    mainWindow.webContents.send('window-resized')
  }
})

// 分离 Tab 成为独立窗口
ipcMain.on('detach-tab', (event, tabType) => {
  createDetachedWindow(tabType)
})

// 关闭独立窗口
ipcMain.on('close-detached-window', (event, tabType) => {
  if (detachedWindows[tabType]) {
    detachedWindows[tabType].close()
  }
})

// 打开新增表单窗口
ipcMain.on('open-form-window', (event, type) => {
  createFormWindow(type)
})

// 关闭新增表单窗口
ipcMain.on('close-form-window', (event, type) => {
  if (formWindows[type]) {
    formWindows[type].close()
  }
})

// 移动窗口 (用于 JS 驱动的平滑拖拽)
ipcMain.on('move-window', (event, { x, y }) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    const [currentX, currentY] = win.getPosition()
    win.setPosition(Math.round(currentX + x), Math.round(currentY + y))
  }
})

// 使用外部浏览器打开链接
ipcMain.on('open-url', (event, url) => {
  shell.openExternal(url)
})

// 关闭应用
ipcMain.handle('close-app', () => {
  app.quit()
})
