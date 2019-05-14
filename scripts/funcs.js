// This file is for general purpose functions
//CodeMirror Properties
const htmlSpec = {
    lineNumbers: true,
    mode: 'xml',
    htmlMode: true,
    theme: 'lucario',
    lineWrapping: true,
    autoCloseTags: true,
    matchTags: true
}

const cssSpec = {
    lineNumbers: true,
    mode: 'css',
    theme: 'lucario',
    lineWrapping: true,
    autoCloseTags: true,
    matchTags: true
}

function toggleDisplay(el) {
    console.log("toggle display")
    el = document.getElementById(el);
    if (!el) return; 
    
    if (el.style.display === 'none') {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}

function toggleClass(el, className) {
    if (!el) return;
    if (typeof el === 'object') {
        el.classList.contains(className) ? el.classList.remove(className) : el.classList.add(className);
    } else if (typeof el === 'string') {
        el = document.querySelectorAll(el);
        for (let i = 0; i < el.length; i++) {
            
            el[i].classList.contains(className) ? el[i].classList.remove(className) : el[i].classList.add(className);
        }
    } else return;
}

function addClass(el, className) {
    if (!el) return;
    if (typeof el === 'object') {
        el.classList.contains(className) === false ? el.classList.add(className) : null;
    } else if (typeof el === 'string') {
        el = document.querySelectorAll(el);
        for (let i = 0; i < el.length; i++) {

            el[i].classList.contains(className) === false ? el[i].classList.add(className) : null;
        }
    } else return;
}

function removeClass(el, className) {
    if (!el) return;
    if (typeof el === 'object') {
        el.classList.contains(className) === true ? el.classList.remove(className) : null;
    } else if (typeof el === 'string') {
        el = document.querySelectorAll(el);
        for (let i = 0; i < el.length; i++) {
            el[i].classList.contains(className) === true ? el[i].classList.remove(className) : null;
        }
    } else return;
}

function hideAll(elements) {
    /* console.log("hideall") */
    let els = document.querySelectorAll(elements);
    for (let i = 0; i < els.length; i++) {
        els[i].style = 'display: none';
    }
}

function hideOthers(elements, dontHide) {
    /* console.log('hideothers') */
    let els = document.querySelectorAll(elements);
    for (let i = 0; i < els.length; i++) {
        if (els[i] !== dontHide) {
            els[i].style = 'display: none';
        }
    }
}

function resetForms(el) {    
    /* console.log('reset forms') */
    let forms = document.querySelectorAll('form');
    if (!forms) return;
    let buttons = document.querySelectorAll('form button');
    
    for (let i = 0; i < forms.length; i++) {
        forms[i].reset();
    }
    if (buttons){
        for (let i = 0; i < buttons.length; i++) {
            console.log(buttons[i])
            removeClass(buttons[i], 'active');
        }
    }
    
    toggleDisplay(el);
}

function targetInEl(parent, child) {
    //If target is inside element return true
    return child !== parent && parent.contains(child);
}

function initMenu(menuEl, btn, subBtns) {
    let menu = document.getElementById(menuEl);
    let menuBtn = document.querySelectorAll(btn);
    let subMenuBtns = document.querySelectorAll(subBtns);
    
    // On menu clicked anywhere, show whatever button is hovered


    // Ensure that when an element that isn't the menu is clicked the menu will hide
    document.addEventListener('mousedown', (e) => {
        if (menu.classList.contains('active')) {
            if (!targetInEl(menu, e.target)) {
                hideAll('.dropdown__menu');
                menu.classList.remove('active')
            }
        }
    });

    // When menu is clicked set to active
    menu.addEventListener('mousedown', (e) => {
        e.preventDefault();
        menu.classList.add('active');
    });

    // Add listeners to all menu buttons that will handle hover and click functionality
    for (let i = 0; i < menuBtn.length; i++) {
        //handle hover functionality
        menuBtn[i].addEventListener('mousemove', (e) => {
            if (menu.classList.contains('active')){
                let currentMenu = e.target.innerHTML.toLowerCase();
                let currentDrpDwn = document.getElementById('dropdown__menu--'+currentMenu);

                //show current hovered, hide all others
                currentDrpDwn.style = "display: block;"
                hideOthers('.dropdown__menu', currentDrpDwn);
            }
        });
        menuBtn[i].addEventListener('mousedown', (e) => {
            if (!menu.classList.contains('active')) {
                let currentMenu = e.target.innerHTML.toLowerCase();
                console.log(currentMenu);
                let currentDrpDwn = document.getElementById('dropdown__menu--'+currentMenu);

                //show current hovered, hide all others
                currentDrpDwn.style = "display: block;"
            }
        });
    }

    //  File menu
        //      - File menu - New Page
        let newFileBtn = document.getElementById('newfilebtn');
        if (newFileBtn) {
            newFileBtn.addEventListener('click', () => {
                hideOthers('.dialogue','#newfileform__container');
                toggleDisplay('newfileform__container');
                toggleDisplay('dropdown__menu--file');
                
            });
        }
        
        //      - File menu - Delete Page
        let delFileBtn = document.getElementById('deletefilebtn');
        if (delFileBtn) {
            delFileBtn.addEventListener('click', () => {
                hideOthers('.dialogue','#deletefileform__container');
                let message = document.getElementById('delete-file-name');
                message.innerHTML = currentPage;
                let input = document.getElementById('file-to-delete');
                input.value = currentPage;
                toggleDisplay('deletefileform__container')
                toggleDisplay('dropdown__menu--file');
            });
        }
        

        //      - File menu - save
        let saveBtn = document.getElementById('savebtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                saveChanges(currentPage);
                toggleDisplay('dropdown__menu--file');
            });
        }
        
        //      - File menu - save all
        let saveAllBtn = document.getElementById('saveallbtn');
        if (saveAllBtn) {
            saveAllBtn.addEventListener('click', () => {
                saveAll();
                toggleDisplay('dropdown__menu--file');
            });
        }
        
        //      - File menu - exit
        let exitBtn = document.getElementById('exitbtn');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                let window = remote.getCurrentWindow();
                if (editorMode !== "gui") {
                    if (unsavedChanges) {
                        let confirmation = confirm('Warning! You have unsaved changes.');
                        if (confirmation) {
                            window.close();
                        }
                    } else window.close();
                } else window.close();
            });
        }
        
        // Edit Menu
        //      - Edit menu 
        let undoBtn = document.getElementById('undobtn');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                editors[currentEditor].doc.undo();
                toggleDisplay('dropdown__menu--edit');
            });    
        }
        
        let redoBtn = document.getElementById('redobtn');
        if (redoBtn) {
            redoBtn.addEventListener('click', () => {
                editors[currentEditor].doc.redo();
                toggleDisplay('dropdown__menu--edit');
            });
        }
        

        //cut copy paste
        let cutBtn = document.getElementById('cutbtn');
        if (cutBtn) {
            cutBtn.addEventListener('click', () => {
                document.execCommand('cut');
                toggleDisplay('dropdown__menu--edit');
            });
        }

        let copyBtn = document.getElementById('copybtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                document.execCommand('copy');
                toggleDisplay('dropdown__menu--edit');
            });
        }
        

        let pasteBtn = document.getElementById('pastebtn');
        if (pasteBtn) {
            pasteBtn.addEventListener('click', () => {
                document.execCommand('paste');
                toggleDisplay('dropdown__menu--edit');
            });
        }

        let deleteBtn = document.getElementById('deletebtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                document.execCommand('delete');
                toggleDisplay('dropdown__menu--edit');
            });
        }

        let enterBtn = document.getElementById('enterbtn');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                CodeMirror.commands.newlineAndIndent(editors[currentEditor]);
                toggleDisplay('dropdown__menu--edit');
            });
        }
        
        let tabBtn = document.getElementById('tabbtn');
        if (tabBtn) {
            tabBtn.addEventListener('click', () => {
                CodeMirror.commands.defaultTab(editors[currentEditor]);
                toggleDisplay('dropdown__menu--edit');
            });
        }
        
        let spaceBtn = document.getElementById('spacebtn');
        if (spaceBtn) {
            spaceBtn.addEventListener('click', () => {
                let cursorPos = editors[currentEditor].getCursor();
                editors[currentEditor].replaceRange(" ",{line: cursorPos.line, ch: cursorPos.ch});
                toggleDisplay('dropdown__menu--edit');
            });
        }
        
        //Preview Menu
        let previewBtn = document.getElementById('previewbtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                pagePreview();
                toggleDisplay('dropdown__menu--preview');
            });
        }
        
        //Tools Menu
        let colorPicker = document.getElementById('color-picker');
        if (colorPicker) {
            colorPicker.addEventListener('click', () => {
                toggleDisplay("colorpicker__container");
                toggleDisplay('dropdown__menu--tools');
            });
        }

        let valuesTool = document.getElementById('values-tool');
        if (valuesTool) {
            valuesTool.addEventListener('click', () => {
                toggleDisplay("valuetool__container");
                toggleDisplay('dropdown__menu--tools');
            });
        }

        let helpTool = document.getElementById('help-tool');
        if (helpTool) {
            helpTool.addEventListener('click', () => {
                toggleDisplay("helptool__container");
                toggleDisplay('dropdown__menu--tools');
                heightBasedOnContainer('.help-pages', "#helptool__container", -70);
            });
        }

        // Mode menu
        let modebtn = document.getElementById('switchmodebtn');
        if (modebtn) {
            modebtn.addEventListener('click', () => {
                toggleDisplay('modeswitch__container');
                toggleDisplay('dropdown__menu--switchmode');
            });
        }
        
}

function pagePreview() {
    console.log(currentProject);
    let path = savesPath.replace(/\\/g, "/");
    let path2 = path.replace(/\s+/g, '%20');
    console.log(currentPage);
    let filePath = editorMode === 'css' ? '/index.html' : '/'+currentPage;
    console.log(path2+currentProject+filePath)
    shell.openExternal('file:///'+path2+currentProject+filePath);

    let previewMenu = document.getElementById('dropdown__menu--preview');
    if (previewMenu.style.display === 'block') {
        previewMenu.style.display = 'none';
    }
}

// TABS AND PAGES - INITIALISATION

function initCMcontainers(details) {
    //div container with id, class of 'editor' and style of z-index: 0;
    //make html containers
    let pages = details.pages;
    let stylesheets = details.stylesheets;
    let container = document.getElementById('pages-container');

    for (let i = 0; i < pages.length; i++) {
        let newPageDetails = pages[i].split('.');
        let newPageName = newPageDetails[0];

        //DOM CREATION
        let pageCont = document.createElement('div');
        pageCont.setAttribute('id', 'page-container-'+newPageName);
        pageCont.setAttribute('style','z-index:0');       
        pageCont.setAttribute('class','editor');       
        
        let textArea = document.createElement('textarea');
        textArea.setAttribute('id','editor-'+newPageName);   
        textArea.setAttribute('style','visibility: hidden; min-height: 1px;');
        
        pageCont.appendChild(textArea);
        container.appendChild(pageCont);   
    }

    // then make css page container
    for (let i = 0; i < stylesheets.length; i++){
        let newCssDetails = stylesheets[i].split('.');
        let newCssName = newCssDetails[0];

        // DOM CREATION
        let cssPageCont = document.createElement('div');
        cssPageCont.setAttribute('id', 'page-container-css-'+newCssName);
        cssPageCont.setAttribute('style','z-index:0');       
        cssPageCont.setAttribute('class','editor');  

        let cssTextArea = document.createElement('textarea');
        cssTextArea.setAttribute('id','editor-css-'+newCssName);   
        cssTextArea.setAttribute('style','visibility: hidden; min-height: 1px;');
    
        cssPageCont.appendChild(cssTextArea);
        container.appendChild(cssPageCont);   
    }
}

function insertCmContainer(data) {
    let pages = data.pages;
    let stylesheets = data.stylesheets;
    let container = document.getElementById('pages-container');
    
    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) {
            let newPageDetails = pages[i].split('.');
            let newPageName = newPageDetails[0];
            //DOM CREATION
            let pageCont = document.createElement('div');
            pageCont.setAttribute('id', 'page-container-'+newPageName);
            pageCont.setAttribute('style','z-index:0');       
            pageCont.setAttribute('class','editor');       
            //textarea with page id and style of: style="visibility: hidden; min-height: 1px;"
            let textArea = document.createElement('textarea');
            textArea.setAttribute('id','editor-'+newPageName);   
            textArea.setAttribute('style','visibility: hidden; min-height: 1px;');
            
            pageCont.appendChild(textArea);
            container.appendChild(pageCont);   
        }
    }
    for (let i = 0; i < stylesheets.length; i++) {
        if (curProjectDetails.stylesheets.indexOf(stylesheets[i]) === -1) {
            let newCssDetails = stylesheets[i].split('.');
            let newCssName = newCssDetails[0];
            //DOM CREATION
            let pageCont = document.createElement('div');
            pageCont.setAttribute('id', 'page-container-css-'+newCssName);
            pageCont.setAttribute('style','z-index:0');       
            pageCont.setAttribute('class','editor');       
            //textarea with page id and style of: style="visibility: hidden; min-height: 1px;"
            let textArea = document.createElement('textarea');
            textArea.setAttribute('id','editor-css-'+newCssName);   
            textArea.setAttribute('style','visibility: hidden; min-height: 1px;');
            
            pageCont.appendChild(textArea);
            container.appendChild(pageCont);   
        }
    }
}

function initCMInstances(details) {
    let pages = details.pages;
    let stylesheets = details.stylesheets;
    
    //instance for each page
    for (let i = 0; i < pages.length; i++) {
        let newPageDetails = pages[i].split('.');
        let newPageName = newPageDetails[0];

        let currentPageCont = document.getElementById('editor-'+newPageName);
        let editor = CodeMirror.fromTextArea(currentPageCont, htmlSpec);
        editor.setSize("100%", "calc(100vh - 70px)");
        editors[pages[i]] = editor;
    }

    //then instance for css file
    
    for (let i = 0; i < stylesheets.length; i++) {
        let newCssDetails = stylesheets[i].split('.');
        let newCssName = newCssDetails[0];

        let cssEditorCont = document.getElementById('editor-css-'+newCssName);
        let cssEditor = CodeMirror.fromTextArea(cssEditorCont, cssSpec);
        cssEditor.setSize("100%", "calc(100vh - 70px)");
        editors[stylesheets[i]] = cssEditor;
    }
    
}

function newCmInstance(data) {
    let pages = data.pages;
    let stylesheets = data.stylesheets;

    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) { 
            let newPageDetails = pages[i].split('.');
            let newPageName = newPageDetails[0];

            let currentPageCont = document.getElementById('editor-'+newPageName);
            let editor = CodeMirror.fromTextArea(currentPageCont, htmlSpec);
            editor.setSize("100%", "calc(100vh - 70px)");
            editors[pages[i]] = editor;
        }
    }

    for (let i = 0; i < stylesheets.length; i++) {
        if (curProjectDetails.stylesheets.indexOf(stylesheets[i]) === -1) { 
            let newCssDetails = stylesheets[i].split('.');
            let newCssName = newCssDetails[0];
            let cssEditorCont = document.getElementById('editor-css-'+newCssName);
            let cssEditor = CodeMirror.fromTextArea(cssEditorCont, cssSpec);
            cssEditor.setSize("100%", "calc(100vh - 70px)");
            editors[stylesheets[i]] = cssEditor;
        }
    }
}

function loadPageContent(details) {
    let pages = details.pages;
    let stylesheets = details.stylesheets;
    for (let i = 0; i < pages.length; i++) {
        fs.readFile(savesPath+details.name+'/'+pages[i],'utf-8', (err, fileData) => {
            if (err) return console.log(err);
  /*           console.log(editors[pages[i]]); */
            editors[pages[i]].setValue(fileData);
            editors[pages[i]].refresh();
            editors[pages[i]].clearHistory();
            pageContent[pages[i]] = editors[pages[i]].getValue();
        });
    }
    for (let i = 0; i < stylesheets.length; i++) {
        fs.readFile(savesPath+details.name+'/css/'+stylesheets[i],'utf-8', (err, fileData) => {
            if (err) return console.log(err);
            /* console.log(fileData) */
            editors[stylesheets[i]].setValue(fileData);
            editors[pages[i]].refresh();
            editors[stylesheets[i]].clearHistory();
            pageContent[stylesheets[i]] = editors[stylesheets[i]].getValue();
        });
    }
    trackChanges();
}

function loadNewPageContent(details) {
    console.log(curProjectDetails);
    let pages = details.pages;
    let stylesheets = details.stylesheets;
    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) {
            fs.readFile(savesPath+details.name+'/'+pages[i],'utf-8', (err, fileData) => {
                if (err) return console.log(err);
                console.log('new page:',pages[i]);
                editors[pages[i]].setValue(fileData)
                editors[pages[i]].clearHistory();
                pageContent[pages[i]] = editors[pages[i]].getValue();
            });
        }
    }

    for (let i = 0; i < stylesheets.length; i++) {
        if (curProjectDetails.stylesheets.indexOf(stylesheets[i]) === -1) {
            fs.readFile(savesPath+details.name+'/css/'+stylesheets[i],'utf-8', (err, fileData) => {
                if (err) return console.log(err);
                console.log('new stylesheet:',stylesheets[i]);
                editors[stylesheets[i]].setValue(fileData)
                editors[stylesheets[i]].clearHistory();
                pageContent[stylesheets[i]] = editors[stylesheets[i]].getValue();
            });
        }
    }
    trackChanges();
}

function setTab(tabEls, pageId/* tabEls, currentTabId, pageId, curPage */) {
    let tabs = document.querySelectorAll(tabEls);
    if (tabs.length === 0) return;

    let pageDetails = pageId.split('.');
    let pageName = pageDetails[0];
    let pageExt = pageDetails[1];
    
    let curTab = pageExt === 'html' ? document.querySelectorAll('#'+pageName+'-tab-btn')[0] : document.querySelectorAll('#'+pageName+'-css-tab-btn')[0];
    let page = pageExt === 'html' ? document.querySelectorAll('#page-container-'+pageName)[0] : document.querySelectorAll('#page-container-css-'+pageName)[0];

    if (!curTab.classList.contains('active')) {
        curTab.classList.add('active');
        page.style = 'display: block';
        for(let i = 0; i < tabs.length; i++) {
            if (tabs[i] !== curTab) {
                tabs[i].classList.remove('active');
            }
        }
    }
    currentPage = pageId;
    currentEditor = pageId;
    pageExt === 'css' ? editorMode = 'css' : editorMode = 'html';
    hideOthers('.editor', page);
}

function htmlTab(pageTitle, parent) {
    let li = document.createElement('li');
    li.setAttribute('class', 'tab__item');
    li.setAttribute('id', pageTitle+'-tab__item');
    let button = document.createElement('button');
    button.setAttribute('id',pageTitle+'-tab-btn');
    button.setAttribute('class','tab-btn');
    let span = document.createElement('span');
    let title = document.createTextNode(pageTitle);
    let extension = document.createTextNode('.html')

    span.appendChild(title);
    button.appendChild(span);
    button.appendChild(extension);
    li.appendChild(button);
    parent.appendChild(li);
}

function cssTab(pageTitle, parent) {
    // Make CSS tab
    let cssLi = document.createElement('li');
    cssLi.setAttribute('class', 'tab__item');
    cssLi.setAttribute('id', pageTitle+'-css-tab__item');
    let cssButton = document.createElement('button');
    cssButton.setAttribute('id',pageTitle+'-css-tab-btn');
    cssButton.setAttribute('class','tab-btn');
    let span = document.createElement('span');
    let relPath = document.createTextNode('/css/');
    let title = document.createTextNode(pageTitle);
    let extension = document.createTextNode('.css');

    span.appendChild(title);
    cssButton.appendChild(relPath);
    cssButton.appendChild(span);
    cssButton.appendChild(extension);
    cssLi.appendChild(cssButton);
    parent.appendChild(cssLi);
}

function initTabs(details) {
    //Dynamically create tabs based of pages
    let tabsList = document.getElementsByClassName('tabs')[0];
    let pages = details.pages;
    let stylesheets = details.stylesheets;
    for (let i = 0; i < pages.length; i++) {
        let tabDetails = pages[i].split('.');
        let tabName = tabDetails[0];
        htmlTab(tabName, tabsList);
    }
    for (let i = 0; i < stylesheets.length; i++) {
        let tabDetails = stylesheets[i].split('.');
        let tabName = tabDetails[0];
        cssTab(tabName, tabsList)
    }
    initTabListeners(details);
}

function addNewTab(details) {
    console.log('DETAILS',details)
    let tabsList = document.getElementsByClassName('tabs')[0];
    let pages = details.pages;
    let stylesheets = details.stylesheets;
    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) {
            let tabDetails = pages[i].split('.');
            let tabName = tabDetails[0];
            htmlTab(tabName, tabsList);
        }
    }
    for (let i = 0; i < stylesheets.length; i++) {
        if (curProjectDetails.stylesheets.indexOf(stylesheets[i]) === -1) {
            let tabDetails = stylesheets[i].split('.');
            let tabName = tabDetails[0];
            cssTab(tabName, tabsList);
        }
    }
    console.log(tabsList);
    initNewTabListener(details);
}

function initTabListeners(details) {

    let pages = details.pages;
    let stylesheets = details.stylesheets;
    // Add listener to all html tabs
    if (pages.length > 0) {
        setTimeout(()=>{
            setTab('.tab-btn', pages[0]);
        },100);
        for (let i = 0; i < pages.length; i++) {
            let tabDetails = pages[i].split('.');
            let tabName = tabDetails[0];
            let tab = document.getElementById(tabName+'-tab-btn');
            tab.addEventListener('click', (e) => {
                setTab('.tab-btn', pages[i]);
            });
        }
    }
    // Add listener to all css tabs
    if (stylesheets.length > 0) {
        for (let i = 0; i < stylesheets.length; i++) {
            // Add listener to css tab
            let tabDetails = stylesheets[i].split('.');
            let tabName = tabDetails[0];
            let cssTab = document.getElementById(tabName+'-css-tab-btn');
            cssTab.addEventListener('click', (e) => {
                setTab('.tab-btn', stylesheets[i]);
            });
        }
    }
    
    if (pages.length == 0 && stylesheets.length > 0) {
        setTimeout(()=>{
            setTab('.tab-btn', stylesheets[0]);
        },100);
    }
}

function initNewTabListener(details) {
    let pages = details.pages;
    let stylesheets = details.stylesheets;
    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) {
            let tabDetails = pages[i].split('.');
            let tabName = tabDetails[0];
            let tab = document.getElementById(tabName+'-tab-btn');
            tab.addEventListener('click', (e) => {
                setTab('.tab-btn', pages[i]);
            });
            setTab('.tab-btn', pages[i]);
        }
    }
    for (let i = 0; i < stylesheets.length; i++) {
        if (curProjectDetails.stylesheets.indexOf(stylesheets[i]) === -1) {
            let tabDetails = stylesheets[i].split('.');
            let tabName = tabDetails[0];
            let tab = document.getElementById(tabName+'-css-tab-btn');
            tab.addEventListener('click', (e) => {
                setTab('.tab-btn', stylesheets[i]);
            });
            setTab('.tab-btn', stylesheets[i]);
        }
    }
}

function updateCurProjectDetails(data) {
    let pages = data.pages;
    let stylesheets = data.stylesheets;
    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) {
            curProjectDetails.pages.push(pages[i]);
        }
    }
    for (let i = 0; i < stylesheets.length; i++) {
        if (curProjectDetails.stylesheets.indexOf(stylesheets[i]) === -1) {
            curProjectDetails.stylesheets.push(stylesheets[i]);
        }
    }
}

function saveAll() {
    let pages = curProjectDetails.pages;
    let stylesheets = curProjectDetails.stylesheets;
    for (let i = 0; i < pages.length; i++ ) {
        saveChanges(pages[i]);
    }
    for (let i = 0; i < stylesheets.length; i++ ) {
        saveChanges(stylesheets[i]);
    }
}

function saveChanges(file) {
    console.log('saving')
    let changes = editors[file].getValue();
    let data = {
        name: currentProject,
        file: file,
        content: changes
    }
    ipcRenderer.send('save:file', data);

    //Update page content for change tracking and remove class that indicates changes made
    pageContent[file] = editors[file].getValue();

    let fileDetails = file.split('.');
    let fileExt = fileDetails[1];
    let tabName = fileExt === 'css' ? '#'+fileDetails[0]+'-css-tab-btn' : '#'+fileDetails[0]+'-tab-btn';
    removeClass(tabName, 'changed');
    checkUnsaved();
}

function trackChanges() {
    Object.entries(editors).forEach(([key, value]) => {
            let curDetails = key.split('.');
            let curExt = curDetails[1];
            let elName = curExt === 'css' ? '#'+curDetails[0]+'-css-tab-btn' : '#'+curDetails[0]+'-tab-btn';
            let newContent;
            
            setTimeout(()=> {
                value.on("change", () => {
                    newContent = value.getValue();
                    if (newContent === pageContent[key]) {
                        unsavedChanges = false;
                        removeClass(elName,'changed');
                    } else if (newContent !== pageContent[key]) {
                        addClass(elName,'changed');
                        unsavedChanges = true;
                    }
                });
            },250)
            
        }
    );  
}

function checkUnsaved() {
    let unsaved = [];
    //Function to check files are unsaved
    Object.entries(editors).forEach(([key, value]) => {
        let newContent;
        
        newContent = value.getValue();
        if (newContent !== pageContent[key]) {
            unsaved.push(key);
        }

    });
    if (unsaved.length > 0) {
        unsavedChanges = true;
    } else if (unsaved.length === 0) {
        unsavedChanges = false;
    }
}  



function rendererDestroyPage(data) {
    // Remove page from renderer/window and all links to it (tabs, variables etc.)

    // Parse file details
    let delFileDetails = data.split('.');
    let delFileName = delFileDetails[0];
    let delFileExt = delFileDetails[1];

    
    if (delFileExt === 'html') {
        //Remove Container
        let container = document.getElementById('page-container-'+delFileName);
        container.parentNode.removeChild(container);
        
        //Remove tab
        let tab = document.getElementById(delFileName+'-tab__item');
        tab.parentNode.removeChild(tab);

        //Remove page from current project index
        let cpdPageIndex = curProjectDetails.pages.indexOf(data)
        curProjectDetails.pages.splice(cpdPageIndex,1);
    } else {
        //Remove Container
        let container = document.getElementById('page-container-css-'+delFileName);
        container.parentNode.removeChild(container);
        
        //Remove tab
        let tab = document.getElementById(delFileName+'-css-tab__item');
        tab.parentNode.removeChild(tab);

        //Remove page from current project index
        let cpdPageIndex = curProjectDetails.stylesheets.indexOf(data)
        curProjectDetails.stylesheets.splice(cpdPageIndex,1);
    }
    // Remove page from editors instances
    delete editors[data];
}

function firstTab() {
    let pageCount = curProjectDetails.pages.length;
    let stylesCount = curProjectDetails.stylesheets.length;
    if (pageCount === 0 && stylesCount === 0) return; //if no tabs 

    //If an html tab (usually shown first on the tabs list) exists
    if (pageCount > 0) {
        return curProjectDetails.pages[0];
    }
    //If there's no html tabs but a css tab exists
    if (pageCount === 0 && stylesCount > 0) {
        return curProjectDetails.stylesheets[0];
    }

}

function noPages() {
    if (curProjectDetails.pages.length === 0 && curProjectDetails.stylesheets.length === 0) {
        toggleDisplay('no-files');
    }
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

function initIframeStyles() {
    setTimeout(() => {
        const iframe = document.getElementsByTagName('iframe')[0];
        const iframeDoc = iframe.contentWindow.document;

        const iframeDocEl = iframe.contentWindow.document.documentElement;
        const iframeBody = iframeDoc.getElementsByTagName('body');

        let styleTag = iframeDoc.createElement('style');
        styleTag.innerHTML = `
            ::-webkit-scrollbar {
                width: 10px;
            }
            
            ::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
                box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
                background-color:rgba(255, 255, 255, 0.24);
            }
            
            ::-webkit-scrollbar-thumb {
            background-color: #d1d1d19d;
            background: linear-gradient(#d1d1d149, #ffffff94, #d1d1d149);
            outline: 1px solid #e87400;
            }

            html {
                cursor: crosshair;
            }

            html > * {
                pointer-events: none;
                user-select: none;
            }
        `
        iframeDocEl.appendChild(styleTag);
    }, 200);
}

function initValuesTool() {
    let container = document.getElementById("valuetool__container");
    let form = document.getElementById("valuetool__form");
    let buttons = document.querySelectorAll("#valuetool__form button");
    let inputs = document.querySelectorAll("#valuetool__form input");
    let submit = document.querySelectorAll("#valuetool__form button[type=submit]");
    container.addEventListener("mousedown", (e)=>{
        e.preventDefault();
    });
    form.addEventListener("mousedown", (e)=>{
        e.preventDefault();
    });
    /* console.log(container, form, buttons,inputs,submit) */

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("mousedown", (e) => {
            e.preventDefault();
            console.log(buttons[i].value);
            if (buttons[i].value === "clear") {
                inputs[0].value = "";
            } else {
                inputs[0].value += buttons[i].value;
                
            }
            
        });
    }

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("mousedown", (e) => {
            e.preventDefault();
        });
    }

    for (let i = 0; i < submit.length; i++) {
        submit[i].addEventListener("mousedown", (e) => {
            e.preventDefault();
            let result = inputs[0].value;
            document.activeElement = result;      
            setTimeout(()=>{
                resetForms("valuetool__container");
            },250)
            
        });
    }
}


function initColorPicker() {
    let pickerSubmit = document.getElementById('hex-submit');
    let rgbPickerSubmit = document.getElementById('rgb-submit');
    let pickerInput = document.getElementsByClassName('jscolor')[0];
    pickerInput.addEventListener('mousedown',(e) => {
        e.preventDefault();
    });

    rgbPickerSubmit.addEventListener("mousedown",(e) => {
        e.preventDefault();
        let styleString = window.getComputedStyle(pickerInput).backgroundColor;
        document.activeElement.value = styleString;
        resetForms("colorpicker__container");
    });

    pickerSubmit.addEventListener("mousedown",(e) => {
        e.preventDefault();
        let picker = document.getElementsByClassName("jscolor")[0];
        document.activeElement.value = '#'+picker.value;
        resetForms("colorpicker__container");
    });
}

function initResize() {
    // Add listener for window resize
    let timeout;
    window.addEventListener('resize',(e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() =>{
            /* console.log("WINHEIGHT",window.innerHeight) */
            let tools = document.getElementsByClassName('dialogue--moveable');
            
            for (let i = 0; i < tools.length; i++) {
                
                tools[i].style.top = window.innerHeight / 2+"px";
                tools[i].style.left = window.innerWidth / 2+"px";
            }
            
        },200);
        heightBasedOnContainer('.help-pages', "#helptool__container", -80)
    });
}

function dragElement(el) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let main = document.getElementById('pages-container');

  if (document.getElementById(el.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(el.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV: 
    el.onmousedown = dragMouseDown;
  }


  function dragMouseDown(e) {
    e.preventDefault();
    
    // get initial cursor position:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    
    document.onmousemove = (e) => {
        elementDrag(e);
        elementOverlap(e);
    }
    
  }

  function elementDrag(e) {
    e.preventDefault();
    
    // Get new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;  

    // Set element's new position:
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
  }

  function elementOverlap(e) {
    let box = el.getBoundingClientRect();
    let xOverlap,
        yOverlap;

    if (box.x > main.offsetWidth - el.offsetWidth) {
        xOverlap = box.x + el.offsetWidth - main.offsetWidth;// Get distance overlapped
        el.style.left = (el.offsetLeft - xOverlap) +'px';// Correct position based on overlap. 
    }
    if (box.x < 0) {
        xOverlap = box.x;
        el.style.left = (el.offsetLeft - xOverlap) + 'px';
    }
    if (box.y < 70) {
        yOverlap = box.y - 70;
        el.style.top = (el.offsetTop - yOverlap) + 'px';
    }
    if (box.y > main.offsetHeight - el.offsetHeight + 70) {
        yOverlap = box.y + el.offsetHeight - (main.offsetHeight + 70);
        el.style.top = (el.offsetTop - yOverlap) +'px';
    }
  }
   

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function heightBasedOnContainer(element, container, offset) {
    el = document.querySelectorAll(element);
    cont = document.querySelectorAll(container);
    if (offset === undefined) offset = 0;
    /* console.log(el, cont, offset) */

    for (let i = 0; i < cont.length; i++) {
        let contHeight = cont[i].offsetHeight;
        let contPadTop = parseInt(window.getComputedStyle(cont[i]).paddingTop);
        let contPadBottom = parseInt(window.getComputedStyle(cont[i]).paddingBottom);
        let vertPadding = contPadTop + contPadBottom;
        /* console.log(contHeight, contPadTop, contPadBottom) */

        for (let j = 0; j < el.length; j++) {
            /* console.log('load'); */
            el[i].style.height = (contHeight - vertPadding + offset) +'px';
        }
    }
}

function initHelpTabs() {
    let tabs = document.querySelectorAll('.help-tab');
    let pages = document.querySelectorAll('.help-page');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', (e) => {
            addClass(tabs[i], 'active');
            for (let j = 0; j < tabs.length; j++) {
                if (tabs[i] !== tabs[j]) {
                    removeClass(tabs[j],'active');
                }
            }
            pages[i].style.display = "block";
            hideOthers('.help-page',pages[i]);
        });
    }
}; 