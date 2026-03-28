const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 数据操作
  getData: () => ipcRenderer.invoke('get-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  
  // 监听数据变化
  onDataUpdated: (callback) => {
    const subscription = (event, data) => callback(data)
    ipcRenderer.on('data-updated', subscription)
    return () => ipcRenderer.removeListener('data-updated', subscription)
  },

  // 监听分离状态变化
  onDetachedTabsUpdated: (callback) => {
    const subscription = (event, tabs) => callback(tabs)
    ipcRenderer.on('detached-tabs-updated', subscription)
    return () => ipcRenderer.removeListener('detached-tabs-updated', subscription)
  },

  // 窗口控制
  resizeMainWindow: (width, height) => ipcRenderer.send('resize-main-window', { width, height }),
  detachTab: (tabType) => ipcRenderer.send('detach-tab', tabType),
  closeDetachedWindow: (tabType) => ipcRenderer.send('close-detached-window', tabType),
  openFormWindow: (type) => ipcRenderer.send('open-form-window', type),
  closeFormWindow: (type) => ipcRenderer.send('close-form-window', type),
  
  // 系统交互
  openUrl: (url) => ipcRenderer.send('open-url', url),
  moveWindow: (x, y) => ipcRenderer.send('move-window', { x, y }),
  closeApp: () => ipcRenderer.invoke('close-app')
})