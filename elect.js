const {app, BrowserWindow, ipcMain} = require('electron');
const sound = require("sound-play");
const { Notification } = require('electron');
const fs = require('fs');
const path = require('path');
const createWindow = () => {
    const window = new BrowserWindow({
      width: 1000,
      height: 600,
      maximizable: true,
      autoHideMenuBar: true,
      hasShadow: false,
      show: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
    });
    // window.setAlwaysOnTop(true, "screen-saver");
    window.setMinimumSize(450, 300);
    window.loadURL("http://localhost:8080/");
    window.webContents.openDevTools();
    // Lấy vị trí hiện tại
  };
  app.on("window-all-closed", () => {
    if (process.platform != "darwin") {
      app.quit();
    }
  });
  app.whenReady().then(() => {
    createWindow();
    
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    ipcMain.on('notiFromRender', (event, message) => {
      new Notification({
        title: message.title,
        body: message.body,
        silent: true
      }).show()
      if(message.type == "finish") {
        sound.play(path.join(__dirname,'./src/assets/sound/notification/success-fanfare-trumpets-6185.mp3'),1)
      }else {
        sound.play(path.join(__dirname,'./src/assets/sound/notification/simple-notification-152054.mp3'),1)
      }
      
    });
  });