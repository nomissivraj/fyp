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

let winX,
    winY,
    winSize;

function createMainWindow() {
    // Set new window object using dimensions and icon
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        'minWidth': 600,
        'minHeight': 500,
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
        width: winSize[0] ,
        height: winSize[1],
        'minWidth': 600,
        'minHeight': 500,
        nodeIntegration: true,
        backgroundColor: '#f5f5f5',
        frame: false,
        icon: path.join(appPath, 'img/app-icon-64x64.png'),
        x : winX,
        y : winY
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
        mainWindow.show();
        guiWindow = null
    });
}

function createTextEditorWindow() {
// Set new window object using dimensions and icon
    textWindow = new BrowserWindow({
        width: winSize[0],
        height: winSize[1],
        'minWidth': 600,
        'minHeight': 500,
        nodeIntegration: true,
        backgroundColor: '#f5f5f5',
        frame: false,
        icon: path.join(appPath, 'img/app-icon-64x64.png'),
        x : winX,
        y : winY
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
        mainWindow.show();
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
    let winPos = mainWindow.getPosition();
    winX = winPos[0];
    winY = winPos[1];
    winSize = mainWindow.getSize();
    console.log('project creation requested');
    newProject(data)
});

ipcMain.on('load:project', (e, data) => {
    let winPos = mainWindow.getPosition();
    winX = winPos[0];
    winY = winPos[1];
    winSize = mainWindow.getSize();
    loadProject(data);
});

ipcMain.on('save:file', (e, data) => {
    console.log('received save request')
    saveFile(data);
});

ipcMain.on('delete:project', (e, data) => {
    deleteProject(data);
});

ipcMain.on('create:file', (e, data) =>{
    createFile(data);
});

ipcMain.on('delete:page', (e, data) => {
    deletePage(data);
});

ipcMain.on('switch:mode', (e, data) => {
    switchToTextEditor(data);
})

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
                // read template files as promises
                let promiseHtml = promiseReadFile(path.join(appPath+templateHtmlPath), 'utf-8');
                let promiseCss = promiseReadFile(path.join(appPath+templateCssPath));
                // Once all template files have been read and resolved proceed to create new files
                Promise.all([promiseHtml, promiseCss]).then((data) => {
                    // create files as promises
                    let promiseCreateHtml = createHtmlFile(projectDetails, data[0], 'index');
                    let promiseCreateCss = createCssFile(projectDetails, data[1], projectDetails.mode+'-'+projectDetails.layout); 
                    /* let promiseImg = promiseImages(projectDetails.name); */
                    copyImage(path.join(appPath+'/templates/img/logo.svg'), path.join(savesPath,projectDetails.name,'/img/logo.svg'));
                    copyImage(path.join(appPath+'/templates/img/logo-footer.svg'), path.join(savesPath,projectDetails.name,'/img/logo-footer.svg'));
                    let promiseUpdate = updateJson(projectDetails);
                    // Once all files have been created and resolved load the project
                    Promise.all([promiseCreateHtml, promiseCreateCss, promiseUpdate]).then((data) => {
                        loadProject(projectDetails.name);
                        mainWindow.webContents.send('fetch:projects');
                    });
                });                
            }
            // IF MODE IS TEXT EDITOR
            if (projectDetails.mode.toLowerCase() === 'text') {
                let promiseHtml = promiseReadFile(path.join(appPath+'/templates/text-template.html'), 'utf-8');
                let promiseCss = promiseReadFile(path.join(appPath+'/templates/css/text-default.css'));
                Promise.all([promiseHtml, promiseCss]).then((data) => {
                    let promiseCreateHtml = createHtmlFile(projectDetails, data[0], 'index');
                    let promiseCreateCss = createCssFile(projectDetails, data[1], projectDetails.mode+'-'+projectDetails.layout); 
                    let promiseUpdate = updateJson(projectDetails);
                    Promise.all([promiseCreateHtml, promiseCreateCss, promiseUpdate]).then((data)=>{
                        loadProject(projectDetails.name);
                        mainWindow.webContents.send('fetch:projects');
                    });
                });
            }      
        }    
    });
}

function copyImage(filePath, newFilePath) {
    
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) throw err;
            fs.writeFile(newFilePath, data, 'binary', err => {
                if (err) reject(err);
                resolve()
            });
        });
    });
}

/* function promiseImages(projectName) {
    
    return new Promise((resolve, reject) => {
        console.log('trying to promise images');
        let imgPath = '/templates/img/';
        let image1 = copyImage(path.join(appPath+imgPath+'logo.svg'), path.join(savesPath,projectName,'/img/logo.svg'));
        let image2 = copyImage(path.join(appPath+imgPath+'logo-footer.svg'), path.join(savesPath,projectName,'/img/logo-footer.svg'));

        Promise.all([image1, image2]).then((data) => {
            
            log.info('all files copied');
            resolve();
        });

    });
} */

function createHtmlFile(project, data, pageName) {
    //write HTML file
    
    data = data.replace('<title>Document</title>','<title>'+pageName+'</title>');

    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(savesPath+project.name+'/'+pageName+'.html'), data, (err) => {
            if (err) { 
                log.error(err);
                reject('fail');
            } else {
                log.info("The html file was saved!");
                resolve();
            }
        }); 
    }); 
    
}

function createCssFile(project, data, fileName) {
    //write css file
    return new Promise((resolve, reject) => {
        fs.mkdir(path.join(savesPath+project.name+'/css') , 0777, (err)=> {
            if (err) {
                reject(err)
                console.log('fail')
            } else {
                fs.writeFile(path.join(savesPath+project.name+'/css/'+fileName+'.css'), data, (err) => {
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
                fs.writeFile(path.join(savesPath,'/projects.json'), JSON.stringify(json, null, 2), err => {
                    if (err) log.error(err);
                    resolve(projectDetails.name);
                });
                
            }            
        });
    });
}

function addPageToJSON(project, pageName) {
    console.log('adding page')
    return new Promise((resolve,reject) =>{
        fs.readFile(path.join(savesPath,'/projects.json'), (err, data)=> {
            if (err) {
                log.error(err)
                reject('fail');
            } else {

                let json = JSON.parse(data);
                for (let i = 0; i < json.length; i++) {
                    if (json[i].name === project.name) {
                        json[i].pages.push(pageName);
                        fs.writeFile(path.join(savesPath,'/projects.json'), JSON.stringify(json, null, 2), (err) => {
                            if (err) log.error(err);
                            resolve(pageName);
                        });
                        
                    }
                }
            }
        });
    });
}

function addStylesheetToJSON(project, fileName) {
    console.log('adding stylesheet')
    return new Promise((resolve,reject) =>{
        fs.readFile(path.join(savesPath,'/projects.json'), (err, data)=> {
            if (err) {
                log.error(err)
                reject('fail');
            } else {

                let json = JSON.parse(data);
                for (let i = 0; i < json.length; i++) {
                    if (json[i].name === project.name) {
                        json[i].stylesheets.push(fileName);
                        fs.writeFile(path.join(savesPath,'/projects.json'), JSON.stringify(json, null, 2), (err) => {
                            if (err) log.error(err);
                            resolve(fileName);
                        });
                        
                    }
                }
            }
        });
    });
}

function removePageFromJSON(details, fileName) {
    console.log('removing file')
    return new Promise((resolve,reject) =>{
        
        fs.readFile(path.join(savesPath,'/projects.json'), (err, data)=> {
            if (err) {
                log.error(err)
                
                reject('fail');
            } else {
                let json = JSON.parse(data);
                for (let i = 0; i < json.length; i++) {
                    if (json[i].name === details.name) {//if matching project
                        console.log('FILENAME',fileName)
                        let fileDetails = fileName.split('.');
                        let fileExt = fileDetails[1];

                        switch(fileExt) {
                            case 'html':
                                //Check pages/html for file to remove from JSON
                                let fileIndex = json[i].pages.indexOf(fileName);
                                json[i].pages.splice(fileIndex, 1);
                                fs.writeFile(path.join(savesPath,'/projects.json'), JSON.stringify(json, null, 2), err => {
                                    resolve(fileName);
                                });
                                
                                break;
                            case 'css':
                                let cssFileIndex = json[i].stylesheets.indexOf(fileName);
                                json[i].stylesheets.splice(cssFileIndex, 1);
                                fs.writeFile(path.join(savesPath,'/projects.json'), JSON.stringify(json, null, 2), err => {
                                    resolve(fileName);
                                });
                                break;
                            default:
                                break;
                        }

                        //check stylesheets/css for file to remove from JSON
                    }
                }
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
            mainWindow.hide();
            ipcMain.once('ready:gui-window', () => {
                guiWindow.webContents.send('load:data', data);
            })
        }
        if (data.mode === 'text') {
            
            createTextEditorWindow();
            mainWindow.hide();
            ipcMain.once('ready:text-window', () => {
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
    let promiseDeleteImg = deleteSubDirFiles(directory+'/img/');

    Promise.all([promiseDeleteCSS, promiseDeleteImg]).then((data)=>{
        //Promise deletion of all files in directory, to enable directory deletion then delete directory if promise resolved
        deleteAllDirFiles(directory).then((data) =>{
            fs.rmdirSync(directory);
            //Remove project from projects JSON
            removeFromJSON(savesPath, projectName);
        });
        
    });
}

function deletePage(details) {
    let fileDetails = details.deletefile.split('.');
    let fileExt = fileDetails[1];

    let delFilePath;
    
    switch(fileExt) {
        case 'css':
            delFilePath = 'css/'+details.deletefile;
            console.log('DELFILE CSS', delFilePath);
            break;
        case 'html':
            delFilePath = details.deletefile;
            console.log('DELFILE', delFilePath);
            break;
        default:
            break;
    }
    removePageFromJSON(details, details.deletefile).then((data) => {
        if (details.mode === 'text') {
            fs.unlink(savesPath+details.name+'/'+delFilePath, (err)=>{
                if (err) return console.log(err);
            });
            textWindow.webContents.send('remove:page', data);
        } else {
            fs.unlink(savesPath+details.name+'/'+delFilePath, (err)=>{
                if (err) return console.log(err);
            });
            guiWindow.webContents.send('remove:page', data);
        }
    });
}


function removeFromJSON(savesPath, projectName) {
    promiseReadFile(path.join(savesPath,'projects.json')).then((data) => {
        let json = JSON.parse(data);
        for (let i = 0; i < json.length; i++) {
            console.log(json[i])
            if (json[i].name === projectName) {
                console.log('match');
                json.splice(i,1);
                console.log(json);
                fs.writeFile(path.join(savesPath,'projects.json'), JSON.stringify(json, null, 2), err => {
                    if (err) log.error(err);
                    console.log('refresh');
                    mainWindow.webContents.send('fetch:projects');
                });
            }
        }    

    }); 
}

function deleteSubDirFiles(directory) {
    return new Promise((resolve, reject)=>{
        fs.readdir(directory, (err) => {
            if (err) {
                console.log(err, directory);
                resolve();
            }
            deleteAllDirFiles(directory).then((data) => {
                fs.rmdir(directory,(err) => { 
                    if (err) {
                        reject()
                    } else resolve();
                });
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
function createFile(details) {
    console.log(details);
    let newFile = details.newfile;
    let fileDetails = newFile.split('.');
    let extension = fileDetails[1];
    let fileName = fileDetails[0];
    console.log(extension);
    switch (extension) {
        case 'css':
            console.log('createCSS');
            promiseReadFile(path.join(appPath+'/templates/css/'+details.mode+'-'+details.layout+'.css'), 'utf-8').then((data) =>{
                createCssFile(details, data, fileName).then((data) => {
                    addStylesheetToJSON(details, newFile).then((data) => {
                        getProjectDetails(details.name).then((data) => {
                            if (details.mode === 'text') {
                                textWindow.webContents.send('insert:page', data);
                            } else {
                                guiWindow.webContents.send('insert:page', data);
                            }
                            
                        });
                        
                    });
                });
            });
            break;
        case 'html':
        console.log('about to read file')
        console.log(path.join(appPath+'/templates/text-template.html'))
            promiseReadFile(path.join(appPath+'/templates/text-template.html'), 'utf-8').then((data) =>{
                console.log('reading file')
                createHtmlFile(details, data, fileName).then((data) => {
                    addPageToJSON(details, newFile).then((data) => {
                        getProjectDetails(details.name).then((data) => {
                            if (details.mode === 'text') {
                                textWindow.webContents.send('insert:page', data);
                            } else {
                                guiWindow.webContents.send('insert:page', data);
                            }
                            
                        });
                        
                    });
                });
            });
            break;
        default:
            break;
    }
    
}

// Function to save file
function saveFile(project) {
    let file = project.file;
    let extension = file.split(".");
    extension = extension[extension.length - 1];
    let filePath = extension === 'css' ? '/css/'+file : file;
    fs.writeFile(path.join(savesPath,project.name,filePath), project.content);
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

function switchToTextEditor(project) {
    promiseReadFile(path.join(savesPath,'projects.json')).then((data) => {
        let json = JSON.parse(data);
        for (let i = 0; i < json.length; i++) {
            if (json[i].name === project.name) {
                json[i].mode = 'text';
                fs.writeFile(path.join(savesPath,'projects.json'),JSON.stringify(json, null, 2), (err) => {
                    if (err) return log.error(err);
                    log.info('Edit Mode for',project.name,'switched to text');
                    mainWindow.webContents.send('project:updated',project); 
                    loadProject(project.name);
                });
            }
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