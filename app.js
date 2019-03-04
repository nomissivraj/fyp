// Set up dependencies
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('file-system');

// Set ENV
process.env.NODE_ENV = 'development'

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
    if (process.env.NODE_ENV !== "production") {
        window.webContents.openDevTools();
    }
    

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

// Catch item:add
ipcMain.on('create:project', (e, data) => {
    newProject(data)
});

/*
// Psuedo code:

On start up - option to load project or create new project
Will need function to name and create project and files

Copy/delete/paste block functions based on layout position - might need to be client-side


//Work out how to package app up as an installer and launcher etc.

*/

/* function makeDirectory(dirName){

    return new Promise((resolve, reject) => {
        fs.mkdirSync(path.join(__dirname+'/saves', dirName), 0777);
        
    });
    //MAYBE TRY MKDIR
}  */

// Function to create new project including folder structure and files
function newProject(projectDetails) {
    console.log("project details", projectDetails.name);
    
    //make directory using 'name'
    fs.mkdir(__dirname+'/saves/'+projectDetails.name+'/', (err)=> {
        if (err) {
            console.log('Failed to create directory', err);
        } else {
            // If no errors
            let testHTML = '<head><link rel="stylesheet" type="text/css" href="style.css"></head><div><h1>Test HTML</h1><p>Delete this later</p></div>'//DELETE THIS LINE LATER AND CORRESPONDING VARIABLE IN WRITEFILE BELOW
            let testCSS = 'h1 {color:red}'//DELETE THIS LINE LATER AND CORRESPONDING VARIABLE IN WRITEFILE BELOW
            
            //***  if 'mode' === read text editor template files, save to variable here and write to the directory created above - finally load project
                
            //***  else if 'mode' === read gui editor template files for the selected 'layout' and write into the directory created - finally load project

            //write index file - update the following blocks to reflect the above proposed if else psuedo
            fs.writeFile(__dirname+'/saves/'+projectDetails.name+'/index.html', testHTML, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The index file was saved!");
            }); 

            //write css file
            fs.writeFile(__dirname+'/saves/'+projectDetails.name+'/style.css', testCSS, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The styles file was saved!");
            }); 
            //update project json file with new project data
            fs.readFile('projects.json', (err, data)=> {
                let json = JSON.parse(data);
                json.push(projectDetails);
                fs.writeFile("projects.json", JSON.stringify(json, null, 2));
            });
        }
    });

    

    // AFTER ABOVE IS RESOLVED OPEN NEW WINDOW AND loadProject()
}

// Function to select working project
function loadProject() {
    // This will need to check project name in projects.json and load all files from the corresponding directory
    // Might need to store each page name in the project json file
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