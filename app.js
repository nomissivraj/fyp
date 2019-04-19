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
const homePath = path.join(app.getPath('documents'),'Voice Developer Projects');
const savesPath = path.join(homePath,'/saves/');
const speechPath = path.join(app.getPath('documents'),'Voice Developer Projects','/speech/');
//if homepath doesn't exist create it etc

// Set Project properties
var sessionProject;

/*
   //////////////////////// CREATE WINDOW FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/

// Init window so that it isn't destroyed in cleanup
let mainWindow,
    guiWindow,
    textWindow/* ,
    testWindow */;

function createMainWindow() {
    // Set new window object using dimensions and icon
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        'minWidth': 600,
        'minHeight': 300,
        nodeIntegration: true,
        backgroundColor: '#f5f5f5',
        frame: false,
        icon: path.join(appPath, 'img/app-icon-64x64.png'),
        show: false
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
    
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

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
        'minWidth': 600,
        'minHeight': 300,
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
        'minWidth': 600,
        'minHeight': 300,
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

ipcMain.on('save:file', (e, data) => {
    console.log('received save request')
    saveFile(data);
});

ipcMain.on('delete:project', (e, data) => {
    deleteProject(data);
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
                let templateHtmlPath;
                let templateCssPath;

                switch(projectDetails.layout.toLowerCase()) {
                    case 'layout1':
                        templateHtmlPath = '/templates/gui-layout1.html';
                        templateCssPath = '/templates/css/gui-layout1.css';  
                        break;
                    case 'layout2':   
                        templateHtmlPath = '/templates/gui-layout2.html';
                        templateCssPath = '/templates/css/gui-layout2.css';                     
                        break;
                    default:
                        console.log('no layout match')
                    
                }
                
                let promiseHtml = promiseReadFile(path.join(appPath+templateHtmlPath), 'utf-8');
                let promiseCss = promiseReadFile(path.join(appPath+templateCssPath));
                Promise.all([promiseHtml, promiseCss]).then((data) => {
                    let promiseCreateHtml = createHtmlFile(projectDetails, data[0]);
                    let promiseCreateCss = createCssFile(projectDetails, data[1]); 
                    let promiseUpdate = updateJson(projectDetails);
                    Promise.all([promiseCreateHtml, promiseCreateCss, promiseUpdate]).then((data)=>{
                        loadProject(projectDetails.name);
                    });
                });                
            }
            // IF MODE IS TEXT EDITOR
            if (projectDetails.mode.toLowerCase() === 'text') {
                let promiseHtml = promiseReadFile(path.join(appPath+'/templates/text-template.html'), 'utf-8');
                let promiseCss = promiseReadFile(path.join(appPath+'/templates/css/text-default.css'));
                Promise.all([promiseHtml, promiseCss]).then((data) => {
                    let promiseCreateHtml = createHtmlFile(projectDetails, data[0]);
                    let promiseCreateCss = createCssFile(projectDetails, data[1]); 
                    let promiseUpdate = updateJson(projectDetails);
                    Promise.all([promiseCreateHtml, promiseCreateCss, promiseUpdate]).then((data)=>{
                        loadProject(projectDetails.name);
                    });
                });
                
            }
            // AFTER ABOVE IS RESOLVED OPEN NEW WINDOW AND loadProject()
            
        }    
    });
}

function createHtmlFile(project, data) {
    //write HTML file
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(savesPath+project.name+'/index.html'), data, (err) => {
            if (err) { 
                log.error(err);
                reject('fail');
            } else {
                log.info("The index file was saved!");
                resolve();
            }
        }); 
    }); 
    
}

function createCssFile(project, data) {
    //write css file
    return new Promise((resolve, reject) => {
        fs.mkdir(path.join(savesPath+project.name+'/css') , 0777, (err)=> {
            if (err) {
                reject(err)
                console.log('balls')
            } else {
                fs.writeFile(path.join(savesPath+project.name+'/css/'+project.mode+'-'+project.layout+'.css'), data, (err) => {
                    if (err) {
                        log.error(err);
                        console.log(err)
                        reject('fail');
                    } else {
                        log.info("The styles file was saved!");
                        resolve(project.name);
                    }
                }); 
            }
        });
        
    });
    
}

function updateJson(projectDetails) {
    //update project json file with new project data
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(savesPath,'/projects.json'), (err, data)=> {
            if (err) {
                log.error(err)
                reject('fail');
            } else {
                let json = JSON.parse(data);
                json.push(projectDetails);
                fs.writeFile(path.join(savesPath,'/projects.json'), JSON.stringify(json, null, 2));
                resolve(projectDetails.name);
            }            
        });
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


function deleteProject(projectName) {
    let directory = path.join(savesPath,projectName);
    if (!checkDirectoryExists(directory)) {
         removeFromJSON(savesPath, projectName);
        return;    
    }

    //Cannot delete a directory that has files, so need to delete files of sub directories then delete those directories before deleting files from main directory and the main directory itself
    let promiseDeleteCSS = deleteSubDirFiles(directory+'/css/');

    Promise.all([promiseDeleteCSS/* , promiseImg etc. */]).then((data)=>{
        //Promise deletion of all files in directory, to enable directory deletion then delete directory if promise resolved
        deleteAllDirFiles(directory).then((data) =>{
            fs.rmdirSync(directory);
            //Remove project from projects JSON
            removeFromJSON(savesPath, projectName);
        });
        
    });
}


function removeFromJSON(savesPath, projectName) {
    promiseReadFile(path.join(savesPath,'projects.json')).then((data) => {
        let json = JSON.parse(data)
        for (let i = 0; i < json.length; i++) {
            console.log(json[i])
            if (json[i].name === projectName) {
                console.log('match');
                json.splice(i,1);
                console.log(json);
                fs.writeFile(path.join(savesPath,'projects.json'), JSON.stringify(json, null, 2));
                console.log('refresh');
                mainWindow.webContents.send('fetch:projects');
            }
        }    

    }); 
}

function deleteSubDirFiles(directory) {
    return new Promise((resolve, reject)=>{
        deleteAllDirFiles(directory).then((data) => {
            fs.rmdir(directory,(err) => { 
                if (err) {
                    reject()
                } else resolve();
            });
        });
    });
}

function deleteAllDirFiles(directory) {

    return new Promise((resolve, reject) =>{
        fs.readdir(directory, (err, files) => {
            console.log('deleting files', files)
            //If files are already deleted - perhaps by user then immediately resolve and proceed with directory deletions
            if (files) {
                if (files.length === 0) resolve();
            
                if (err) {
                    log.error(err);
                    reject(err);
                } else {
                    for (let i = 0; i < files.length; i++) {
                        fs.unlink(path.join(directory,files[i]), err => {
                            if (err) {
                                log.error(err);
                                reject(err);
                            } else if (i === files.length -1) {
                                resolve();
                            }
                        });
                    }
                }
            } else return;
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
function saveFile(project) {
    let file = project.file;
    let extension = file.split(".");
    extension = extension[extension.length - 1];
    let filePath = extension === 'css' ? '/css/'+file : file;
    fs.writeFile(path.join(savesPath,project.name,filePath), project.content);
}

function checkChanges() {

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
    fs.mkdir(path.join(app.getPath('documents'),'Voice Developer Projects'), 0777, (err)=> { 
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
            fs.mkdir(path.join(speechPath), 0777, (err)=> { 
                if (err) {
                    log.error(err);
                } else {
                    log.info("Speech file path set up!");
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
    if(!checkDirectoryExists(speechPath)) createUserStructure();
    if(!checkFileExists(savesPath+'projects.json')) createUserStructure();  
    
});

// Kill program if all windows closed
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});