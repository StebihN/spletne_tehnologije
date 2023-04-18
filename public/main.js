const { app, BrowserWindow, globalShortcut, nativeTheme } = require('electron')
require('@electron/remote/main').initialize()

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#FFF",
    icon: `${__dirname}/favicon.ico`,
    webPreferences: {
      enableRemoteModule: true
    }
  })

  if (nativeTheme.shouldUseDarkColors) {
    win.webContents.send('toggle-dark-mode');
    win.setBackgroundColor("#303030")
  }

  win.loadURL("http://localhost:3000")
}

app.whenReady().then(() => {
  globalShortcut.register('Tab', () => {
    console.log("Tab was pressed")
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      const contents = focusedWindow.webContents;
      contents.sendInputEvent({ type: 'keyDown', keyCode: 'Tab' });
      contents.sendInputEvent({ type: 'keyUp', keyCode: 'Tab' });
    }

  })

  globalShortcut.register('Escape', () => {
    console.log("Escape was pressed")
    const currentWindow = BrowserWindow.getFocusedWindow()
    if (currentWindow) {
      const contents = currentWindow.webContents;
      contents.goBack();
    }
  })

  globalShortcut.register('D', () => {
    const currentWindow = BrowserWindow.getFocusedWindow()
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
      currentWindow.setBackgroundColor("#FFF")
    } else {
      nativeTheme.themeSource = 'dark';
      currentWindow.setBackgroundColor("#303030")
    }

    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('toggle-dark-mode');
    });
  });

}).then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
})