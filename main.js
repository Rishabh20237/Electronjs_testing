const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater'); // Use `autoUpdater` from 'electron-updater'

let mainWindow;
autoUpdater.autoUpdater=true;
autoUpdater.autoDownload=true;


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

  // Handle update events
  autoUpdater.on("update-available", (info) => {
    console.log("Update available: ", info.version);
    // Optionally, show a notification to inform the user
    dialog.showMessageBox(mainWindow, {
      type: "info",
      title: "Update Available",
      message: `Version ${info.version} is available. Do you want to update now?`,
      buttons: ["Yes", "Later"]
    }).then(result => {
      if (result.response === 0) { // User clicked 'Yes'
        autoUpdater.downloadUpdate(); // Start downloading the update
      }
    });
  });

  autoUpdater.on("update-not-available", (info) => {
    console.log("Update not available: ", info.version);
  });

  autoUpdater.on("update-downloaded", (info) => {
    console.log("Update downloaded: ", info.version);

    // Optionally, you can prompt the user to restart the app
    dialog.showMessageBox(mainWindow, {
      type: "info",
      title: "Update Downloaded",
      message: `Version ${info.version} has been downloaded. Would you like to install it now?`,
      buttons: ["Restart Now", "Later"]
    }).then(result => {
      if (result.response === 0) { // User clicked 'Restart Now'
        autoUpdater.quitAndInstall(); // Quit and install the update
      }
    });
  });

  // Handle errors
  autoUpdater.on("error", (error) => {
    console.error("Error during auto-update: ", error);
  });
});

// Quit the app gracefully when it's closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
