const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', { // exposeInMainWorld :  đăng ký các đối tượng và hàm vào phạm vi toàn cục của Renderer Process.
    sendNotification: (data) => {
        ipcRenderer.send('notiFromRender', data);
    },
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
})