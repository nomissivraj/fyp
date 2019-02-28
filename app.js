// Set up dependencies
const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('file-system');

// Init window so that it isn't destroyed in cleanup
let window;

function createWindow() {
    // Set new window object using dimensions and icon
    window = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 400,
        minHeight: 300,
        nodeIntegration: true,
        backgroundColor: '#f5f5f5',
        frame: false,
        icon: path.join(__dirname, 'img/app-icon-64x64.png')
    });
    
    // Window loading method - use index.html with file protocol
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    // Enable devtools if not production
   /*  if (process.env.NODE_ENV !== "production") {
        window.webContents.openDevTools();
    } */
    

    window.on('closed', () => {
        win = null
    });

    /* var menu = Menu.buildFromTemplate([
        {
            label: 'Meny',
            submenu: [
                {label: 'First'},
                {label: 'Second'},
                {label: 'Third'}
            ]
        }
    ]);

    Menu.setApplicationMenu(menu); */
}

/*
// Psuedo code:

On start up - option to load project or create new project
Will need function to name and create project and files

Copy/delete/paste block functions based on layout position - might need to be client-side


//Work out how to package app up as an installer and launcher etc.

*/


// Function to create new project including folder structure and files
function newProject(projectName, layout) {

}

// Function to select working project
function loadProject() {

}

// Function to create new page
function newPage() {

}

// Function to save html - possibly form/POST method that sends string back to be saved to file.
function saveHTML() {

}

// Function to save CSS to css file
function saveCSS() {

}

// Function to save entire project
function saveProject() {
    saveHTML();
    saveCSS();
}

// Function to copy block
function copyBlock() {
    //clear temp clipboard storage/variable 

    //identify block to copy
    //copy block into temp clipboard storage/variable
}

// Function to paste block
function pasteBlock() {
    // If nothing in clipboard storage/variable don't run
    
    // Identify location to place block
    // append data from clipboard storage/variable into identified location
}

// Function to delete block
function deleteBlock() {
    // Identify block to be deleted
    // Confirm deletion
    // Delete block
}

//Auto save function?
function autoSave() {
    // save every 5mins?
}

// On ready call window function
app.on('ready', createWindow);


// ROUTES

/* app.get('/new', (req, res) => {
    res.
}); */

// Kill program if all windows closed
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});