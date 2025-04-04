const {app, BrowserWindow, ipcMain} = require("electron");
const sound = require("sound-play");
const { Notification } = require('electron');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Tạo server Express
const server = express();
let PORT = 3000; // Cổng mặc định, nhưng sẽ tự động tìm cổng trống nếu cổng này đã được sử dụng
let serverRunning = false;
const distPath = path.join(__dirname, 'dist');

// Hàm tìm cổng trống
function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const testServer = require('net').createServer();
    testServer.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        // Cổng đã được sử dụng, thử cổng tiếp theo
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    testServer.once('listening', () => {
      // Tìm thấy cổng trống
      const port = testServer.address().port;
      testServer.close(() => {
        resolve(port);
      });
    });
    testServer.listen(startPort);
  });
}

// Phục vụ các file tĩnh từ thư mục dist
async function startServer() {
  if (serverRunning) return true;
  
  // Kiểm tra xem thư mục dist có tồn tại không
  if (!fs.existsSync(distPath)) {
    console.error('Thư mục dist không tồn tại. Vui lòng chạy lệnh npm run build trước.');
    return false;
  }
  
  try {
    // Tìm cổng trống
    PORT = await findAvailablePort(PORT);
    console.log(`Tìm thấy cổng trống: ${PORT}`);
  } catch (err) {
    console.error('Không thể tìm cổng trống:', err);
    return false;
  }
  // Cấu hình Express để phục vụ các file tĩnh
  server.use(express.static(distPath));
  
  // Định tuyến cho các request khác về index.html (cho Vue router)
  // Sử dụng đường dẫn cụ thể thay vì dùng '*' để tránh lỗi path-to-regexp
  server.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  
  // Thêm các đường dẫn cụ thể khác nếu cần
  server.get('/index.html', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  
  // Khởi động server
  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
      serverRunning = true;
      resolve(true);
    }).on('error', (err) => {
      console.error('Lỗi khi khởi động server:', err);
      resolve(false);
    });
  });
}

// Kiểm tra xem thư mục dist có tồn tại không
const checkDistFolder = () => {
  const indexPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(distPath)) {
    console.error('Thư mục dist không tồn tại. Vui lòng chạy lệnh npm run build trước.');
    return false;
  }
  
  if (!fs.existsSync(indexPath)) {
    console.error('File index.html không tồn tại trong thư mục dist. Vui lòng chạy lệnh npm run build trước.');
    return false;
  }
  
  return true;
}

const createWindow = async () => {
  // Kiểm tra thư mục dist và khởi động server web
  if (!checkDistFolder()) {
    app.quit();
    return;
  }
  
  // Khởi động server web
  const serverStarted = await startServer();
  if (!serverStarted) {
    app.quit();
    return;
  }
    const window = new BrowserWindow({
      width: 1000,
      height: 600,
      maximizable: true,
      autoHideMenuBar: true,
      hasShadow: false,
      show: true,
      // Sử dụng file .icns đã được tạo bởi electron-icon-builder
      icon: path.join(__dirname, 'icons/icons/mac/icon.icns'),
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
    });
    // Mặc định bật chế độ ghim cửa sổ
    window.setAlwaysOnTop(true, "screen-saver");
    window.setMinimumSize(450, 300);
    // Sử dụng server web thay vì file local
    window.loadURL(`http://localhost:${PORT}/`);
    
    // Thêm phương thức để bật/tắt chế độ ghim cửa sổ
    ipcMain.handle('toggle-pin-window', (event, shouldPin) => {
      window.setAlwaysOnTop(shouldPin, "screen-saver");
      return shouldPin;
    });
    // window.webContents.openDevTools();
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