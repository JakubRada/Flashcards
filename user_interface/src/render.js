// required dependencies
const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow } = electron;

let mainWindow;
// waiting for the app to be ready
app.on('ready', function() {
    // creating main window
    mainWindow = new BrowserWindow({
        width: 1200,
        minWidth: 800,
        height: 900,
        minHeight: 600,
        title: 'Flashcards',
        center: true,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    // removes the upper menu bar
    mainWindow.setMenu(null);
    // loading mainWindow.html with correct path
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    // mainWindow.webContents.openDevTools();
    // Quit app when closed
    mainWindow.on('closed', function() {
        app.quit();
    });
});
