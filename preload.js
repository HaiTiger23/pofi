const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', { // exposeInMainWorld :  đăng ký các đối tượng và hàm vào phạm vi toàn cục của Renderer Process.
    sendNotification: (data) => {
        ipcRenderer.send('notiFromRender', data);
    },
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // Thêm API để bật/tắt chế độ ghim cửa sổ
    togglePinWindow: (shouldPin) => ipcRenderer.invoke('toggle-pin-window', shouldPin)
})