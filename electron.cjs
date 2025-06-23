const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,         // Launch in fullscreen
    frame: false,             // Removes the top bar (title bar and borders)
    kiosk: true,              // Locks the app in fullscreen mode (even disables ALT+F4, ESC, etc. on Windows)
    webPreferences: {
      contextIsolation: true
    }
  });

  const indexPath = isDev
    ? 'http://localhost:8080'
    : path.join(__dirname, 'dist/index.html');

  if (isDev) {
    win.loadURL(indexPath);
  } else {
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
