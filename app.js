// Set up dependencies
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('file-system');
const log = require('electron-log');
const remote = require('electron').remote;

// Set ENV
process.env.NODE_ENV = 'development'
const appPath = __dirname;
const homePath = path.join(app.getPath('documents'),'Vocal Developer Projects');
const savesPath = path.join(homePath,'/saves/');
//if homepath doesn't exist create it etc

// Set Project properties
var sessionProject;

/*
   //////////////////////// CREATE WINDOW FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/

// Init window so that it isn't destroyed in cleanup
let mainWindow,
    guiWindow,
    textWindow;

function createMainWindow() {
    // Set new window object using dimensions and icon
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 400,
        minHeight: 300,
        nodeIntegration: true,
        backgroundColor: '#f5f5f5',
        frame: false,
        icon: path.join(appPath, 'img/app-icon-64x64.png')
    });
    
    // Window loading method - use index.html with file protocol
    mainWindow.loadURL(url.format({
        pathname: path.join(appPath, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    // Enable devtools if not production
    if (process.env.NODE_ENV !== "production") {
        mainWindow.webContents.openDevTools();
    }
    

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    /* var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {label: 'First'},
                {label: 'Second'},
                {label: 'Third'}
            ]
        }
    ]);

    Menu.setApplicationMenu(menu); */
}

function createGuiWindow() {
// Set new window object using dimensions and icon
    guiWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 400,
        minHeight: 300,
        nodeIntegration: true,
        backgroundColor: '#f5f5f5',
        frame: false,
        icon: path.join(appPath, 'img/app-icon-64x64.png')
    });
    
    // Window loading method - use index.html with file protocol
    guiWindow.loadURL(url.format({
        pathname: path.join(appPath, 'gui-editor.html'),
        protocol: 'file',
        slashes: true
    }));

    // Enable devtools if not production
    if (process.env.NODE_ENV !== "production") {
        guiWindow.webContents.openDevTools();
    }
    

    guiWindow.on('closed', () => {
        guiWindow = null
    });
}

function createTextEditorWindow() {
// Set new window object using dimensions and icon
    textWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 400,
        minHeight: 300,
        nodeIntegration: true,
        backgroundColor: '#f5f5f5',
        frame: false,
        icon: path.join(appPath, 'img/app-icon-64x64.png')
    });
    
    // Window loading method - use index.html with file protocol
    textWindow.loadURL(url.format({
        pathname: path.join(appPath, 'text-editor.html'),
        protocol: 'file',
        slashes: true
    }));

    // Enable devtools if not production
    if (process.env.NODE_ENV !== "production") {
        textWindow.webContents.openDevTools();
    }
    

    textWindow.on('closed', () => {
        textWindow = null
    });
}

/*
   //////////////////////// END WINDOW FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/

/*
   //////////////////////// RENDERER COMMUNICATIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/

// Catch items
ipcMain.on('create:project', (e, data) => {
    console.log('project creation requested');
    newProject(data)
});

ipcMain.on('load:project', (e, data) => {
    loadProject(data);
});

ipcMain.on('save:project', (e, data) => {
    saveProject(data);
});


//send items

/*
   //////////////////////// END RENDERER COMMUNICATIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/


/*
   //////////////////////// MAIN APP FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/


// Function to create new project including folder structure and files
function newProject(projectDetails) {
   
    //make directory using 'name'
    fs.mkdir(path.join(savesPath+projectDetails.name+'/'), 0777, (err)=> {
        if (err) {
            log.error('Failed to create directory', err);
        } else {

            // If no errors
            //IF MODE IS GUI EDITOR
            if (projectDetails.mode.toLowerCase() === 'gui') {
                promiseReadFile(path.join(appPath+'/templates/gui-template.html'), 'utf-8').then((data) => {
                    //log.info(data);
                    createHtmlFile(projectDetails.name, data);
                    loadProject(projectDetails.name);
                });

                promiseReadFile(path.join(appPath+'/templates/gui-styles.css')).then((data) => {
                    //log.info(data);
                    createCssFile(projectDetails.name, data); 
                });
                updateJson(projectDetails);
                
            }
            // IF MODE IS TEXT EDITOR
            if (projectDetails.mode.toLowerCase() === 'text') {
                promiseReadFile(path.join(appPath+'/templates/text-template.html'), 'utf-8').then((data) => {
                    //log.info(data);
                    createHtmlFile(projectDetails.name, data);
                    loadProject(projectDetails.name);
                });

                promiseReadFile(path.join(appPath+'/templates/text-styles.css')).then((data) => {
                    //log.info(data);
                    createCssFile(projectDetails.name, data); 
                });
                updateJson(projectDetails);
                
            }
            // AFTER ABOVE IS RESOLVED OPEN NEW WINDOW AND loadProject()
            
        }    
    });
}

function createHtmlFile(projectName, data) {
    //write HTML file
    fs.writeFile(path.join(savesPath+projectName+'/index.html'), data, (err) => {
        if (err) return log.error(err);
        log.info("The index file was saved!");
    }); 
}

function createCssFile(projectName, data) {
    //write css file
    fs.writeFile(path.join(savesPath+projectName+'/style.css'), data, (err) => {
        if (err) return log.error(err);

        log.info("The styles file was saved!");
    }); 
    
}

function updateJson(projectDetails) {
    //update project json file with new project data
    fs.readFile(path.join(savesPath,'/projects.json'), (err, data)=> {
        if (err) return log.error(err);

        let json = JSON.parse(data);
        json.push(projectDetails);
        fs.writeFile(path.join(savesPath,'/projects.json'), JSON.stringify(json, null, 2));
    });
}


// Function to select working project
function loadProject(projectId) {
    log.info('trying to load', projectId);
    // Might need to store each page name in the project json file

    //Get project details using promise then load based off resolved/returned values
    getProjectDetails(projectId).then((data) => {
        log.info("data:",data)
        if (data.mode === 'gui') {
            createGuiWindow();
            mainWindow.close();
            ipcMain.on('ready:gui-window', () => {
                guiWindow.webContents.send('load:data', data);
            })
        }
        if (data.mode === 'text') {
            createTextEditorWindow();
            mainWindow.close();
            ipcMain.on('ready:text-window', () => {
                textWindow.webContents.send('load:data', data);
            })
        }
    });
}

function getProjectDetails(projectId) {
    return new Promise((resolve, reject) => {
        let test = null;
        fs.readFile(path.join(savesPath,'projects.json'), (err, data) => {
        
            if (err) return log.error(err);
    
            let projects = JSON.parse(data);
            for (let i = 0; i < projects.length; i++) {
    
                //log.error("input:", projectId.toLowerCase(),"in file:",projects[i].name.toLowerCase())
                if (projectId.toLowerCase() === projects[i].name.toLowerCase()) {
                    resolve(projects[i])
                } 
            }
        });
    });
}

function promiseReadFile(filePath, encode) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, encode, (err, data) => {
            if (data) {
                resolve(data)
            } else reject();
        });
    });
}


// Function to create new page
function newPage() {

}

// Function to save html - possibly form/POST method that sends string back to be saved to file.
function saveHTML(project) {

}

// Function to save CSS to css file
function saveCSS(project) {

}

// Function to save entire project
function saveProject(projectName) {
    saveHTML(projectName);
    saveCSS(projectName);
}

function checkChanges() {

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
    // save every 10mins?
}

/*
   //////////////////////// END MAIN APP FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/

/* prerequisit functions */

function checkFileExists(path) {
    try {
        if (fs.existsSync(path)) {
            return true;
        }
    } catch(e) {
        return false;
    }
}

function checkDirectoryExists(path) {
    try {
        let checkPath = fs.lstatSync(path);
        if (checkPath.isDirectory()) {
            return true;
        }
    } catch (e) {
        return false;
    }
}

function createUserStructure() {
    fs.mkdir(path.join(app.getPath('documents'),'Vocal Developer Projects'), 0777, (err)=> { 
        if (err) {
            log.error(err)
        } else {
            fs.mkdir(path.join(savesPath), 0777, (err)=> { 
                if (err) {
                    log.error(err);
                } else {
                    fs.writeFile(path.join(savesPath,'projects.json'), '[]', (err) => {
                        if (err) return console.log(err)//log.error(err);
                        log.info("Public directories and projects file set up!");
                    }); 
                }
            });
        }
    });
}


// On ready call window function
app.on('ready', () => {
    createMainWindow()
    console.log(app.getPath('documents'))
    // If home path exists do nothing else create directory etc.
    if(!checkDirectoryExists(homePath)) createUserStructure(); 
    if(!checkDirectoryExists(savesPath)) createUserStructure();
    if(!checkFileExists(savesPath+'projects.json')) createUserStructure();  
    
});

// Kill program if all windows closed
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});