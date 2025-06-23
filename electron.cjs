const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
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