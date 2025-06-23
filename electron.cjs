const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    frame: false,
    kiosk: true,
    webPreferences: {
      contextIsolation: true
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:8080');
  } else {
    // 🔥 Correct path resolution
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    win.loadFile(indexPath);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // On Windows, close the app when all windows are closed
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // On macOS, recreate a window in the app when the dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
