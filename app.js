// Set up dependencies
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// Init window so that it isn't destroyed in cleanup
let window;

function createWindow() {
    // Set new window object using dimensions and icon
    window = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        //frame: false,
        icon: path.join(__dirname, 'img/app-icon-64x64.png')
    });
    
    // Window loading method - use index.html with file protocol
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    // Enable devtools
    window.webContents.openDevTools();

    window.on('closed', () => {
        win = null
    });
}

// On ready call window function
app.on('ready', createWindow);

// Kill program if all windows closed
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});