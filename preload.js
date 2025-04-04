const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', { 
    sendNotification: (data) => {
        ipcRenderer.send('notiFromRender', data);
    },
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // Thêm API để bật/tắt chế độ ghim cửa sổ
    togglePinWindow: (shouldPin) => ipcRenderer.invoke('toggle-pin-window', shouldPin),
    // Thêm API để cập nhật badge trên dock macOS
    updateDockBadge: (text, isBreak) => ipcRenderer.invoke('update-dock-badge', text, isBreak)
})