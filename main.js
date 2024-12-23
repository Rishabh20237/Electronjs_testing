const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater'); // Ensure this is from 'electron-updater'

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');

  // Check for updates
  autoUpdater.checkForUpdates();

  // Notify when an update is downloaded
  autoUpdater.on('update-downloaded', () => {
    const options = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Update Available',
      message: 'An update has been downloaded. Restart the application to apply the update.',
    };

    dialog.showMessageBox(mainWindow, options).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  // Handle update errors
  autoUpdater.on('error', (error) => {
    console.error('Update error:', error);
  });
});
