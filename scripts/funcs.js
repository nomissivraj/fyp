// This file is for general purpose functions
//CodeMirror Properties
const htmlSpec = {
    lineNumbers: true,
    mode: 'xml',
    htmlMode: true,
    theme: 'lucario',
    lineWrapping: true,
    autoCloseTags: true,
    matchTags: true,
}

const cssSpec = {
    lineNumbers: true,
    mode: 'css',
    theme: 'lucario',
    lineWrapping: true,
    autoCloseTags: true,
    matchTags: true,
}

function toggleDisplay(el) {
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


function hideAll(elements) {
    let els = document.querySelectorAll(elements);
    for (let i = 0; i < els.length; i++) {
        els[i].style = 'display:none';
    }
}

function hideOthers(elements, dontHide) {
    let els = document.querySelectorAll(elements);
    for (let i = 0; i < els.length; i++) {
        if (els[i] !== dontHide) {
            els[i].style = 'display: none';
        }
    }
}

function resetForms(el) {    
    let forms = document.querySelectorAll('form');
    for (let i = 0; i < forms.length; i++) {
        forms[i].reset();
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
        if (!targetInEl(menu, e.target)) {
            hideAll('.dropdown__menu');
            menu.classList.remove('active')
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
                let currentDrpDwn = document.getElementById('dropdown__menu--'+currentMenu);

                //show current hovered, hide all others
                currentDrpDwn.style = "display: block;"
            }
        });
    }

    //  File menu
        //      - File menu - New Page
        let newFileBtn = document.getElementById('newfilebtn');
        newFileBtn.addEventListener('click', () => {
            hideOthers('.dialogue','#newfileform__container');
            toggleDisplay('newfileform__container');
            toggleDisplay('dropdown__menu--file');
            
        });
        //      - File menu - Delete Page
        let delFileBtn = document.getElementById('deletefilebtn');
        delFileBtn.addEventListener('click', () => {
            hideOthers('.dialogue','#deletefileform__container');
            let input = document.getElementById('file-to-delete');
            input.value = currentPage;
            toggleDisplay('deletefileform__container')
            toggleDisplay('dropdown__menu--file');
        });

        //      - File menu - save
        let saveBtn = document.getElementById('savebtn');
        saveBtn.addEventListener('click', () => {
            saveChanges(currentProject);
        });
        //      - File menu - exit
        let exitBtn = document.getElementById('exitbtn');
        exitBtn.addEventListener('click', () => {
            let window = remote.getCurrentWindow();
            window.close();
        });
        // Edit Menu
        //      - Edit menu 
        let undoBtn = document.getElementById('undobtn');
        undoBtn.addEventListener('click', () => {
            editors[currentEditor].doc.undo();
            toggleDisplay('dropdown__menu--edit');
        });

        let redoBtn = document.getElementById('redobtn');
        redoBtn.addEventListener('click', () => {
            editors[currentEditor].doc.redo();
            toggleDisplay('dropdown__menu--edit');
        });

        //cut copy paste
        let cutBtn = document.getElementById('cutbtn');
        cutBtn.addEventListener('click', () => {
            document.execCommand('cut');
            toggleDisplay('dropdown__menu--edit');
        });

        let copyBtn = document.getElementById('copybtn');
        copyBtn.addEventListener('click', () => {
            document.execCommand('copy');
            toggleDisplay('dropdown__menu--edit');
        });

        let pasteBtn = document.getElementById('pastebtn');
        pasteBtn.addEventListener('click', () => {
            document.execCommand('paste');
            toggleDisplay('dropdown__menu--edit');
        });

        let deleteBtn = document.getElementById('deletebtn');
        deleteBtn.addEventListener('click', () => {
            document.execCommand('delete');
            toggleDisplay('dropdown__menu--edit');
        });

        let enterBtn = document.getElementById('enterbtn');
        enterBtn.addEventListener('click', () => {
            CodeMirror.commands.newlineAndIndent(editors[currentEditor]);
            toggleDisplay('dropdown__menu--edit');
        });

        let tabBtn = document.getElementById('tabbtn');
        tabBtn.addEventListener('click', () => {
            CodeMirror.commands.defaultTab(editors[currentEditor]);
            toggleDisplay('dropdown__menu--edit');
        });

        let spaceBtn = document.getElementById('spacebtn');
        spaceBtn.addEventListener('click', () => {
            let cursorPos = editors[currentEditor].getCursor();
            editors[currentEditor].replaceRange(" ",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--edit');
        });

        //Preview Menu
        let previewBtn = document.getElementById('previewbtn');
        previewBtn.addEventListener('click', () => {
            pagePreview();
            toggleDisplay('dropdown__menu--preview');
        })

        //Tags Menu
        let heading1 = document.getElementById('heading1btn');
        heading1.addEventListener('click', () => {
            let cursorPos = editors[currentEditor].getCursor();
            editors[currentEditor].replaceRange("<h1></h1>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });

        let heading2 = document.getElementById('heading2btn');
        heading2.addEventListener('click', () => {
            let cursorPos = editors[currentEditor].getCursor();
            editors[currentEditor].replaceRange("<h2></h2>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });

        let heading3 = document.getElementById('heading3btn');
        heading3.addEventListener('click', () => {
            let cursorPos = editors[currentEditor].getCursor();
            editors[currentEditor].replaceRange("<h3></h3>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });

        let heading4 = document.getElementById('heading4btn');
        heading4.addEventListener('click', () => {
            let cursorPos = editors[currentEditor].getCursor();
            editors[currentEditor].replaceRange("<h4></h4>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });

        let heading5 = document.getElementById('heading5btn');
        heading5.addEventListener('click', () => {
            let cursorPos = editors[currentEditor].getCursor();
            editors[currentEditor].replaceRange("<h5></h5>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });

        let heading6 = document.getElementById('heading6btn');
        heading6.addEventListener('click', () => {
            let cursorPos = editors[currentEditor].getCursor();
            editors[currentEditor].replaceRange("<h6></h6>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });
}

function pagePreview() {
    console.log(currentProject);
    let path = savesPath.replace(/\\/g, "/");
    let path2 = path.replace(/\s+/g, '%20');
    console.log(currentPage);
    let filePath = editorMode === 'css' ? '/index.html' : '/'+currentPage;
    console.log(path2+currentProject+filePath)
    shell.openExternal('file:///'+path2+currentProject+filePath);
    toggleDisplay('dropdown__menu--preview');
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
        console.log(cssEditorCont)
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
            editors[pages[i]].setValue(fileData)
            editors[pages[i]].clearHistory();
        });
    }
    for (let i = 0; i < stylesheets.length; i++) {
        fs.readFile(savesPath+details.name+'/css/'+stylesheets[i],'utf-8', (err, fileData) => {
            if (err) return console.log(err);
            /* console.log(fileData) */
            editors[stylesheets[i]].setValue(fileData)
            editors[stylesheets[i]].clearHistory();
        });
    }
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
            });
        }
    }

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

function saveChanges(currentProject) {
    console.log('saving')
    let changes = editors[currentEditor].getValue();
    let data = {
        name: currentProject,
        file: currentPage,
        content: changes
    }
    ipcRenderer.send('save:file', data)
    toggleDisplay('dropdown__menu--file');
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