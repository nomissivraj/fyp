// This file is for general purpose functions
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
        let newPageBtn = document.getElementById('newpagebtn');
        newPageBtn.addEventListener('click', () => {
            hideOthers('.dialogue','#newpageform__container');
            toggleDisplay('newpageform__container');
            toggleDisplay('dropdown__menu--file');
            
        });
        //      - File menu - Delete Page
        let delPageBtn = document.getElementById('deletepagebtn');
        delPageBtn.addEventListener('click', () => {
            hideOthers('.dialogue','#deletepageform__container');
            let input = document.getElementById('page-to-delete');
            input.value = currentPage;
            toggleDisplay('deletepageform__container')
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
    let filePath = editorMode === 'css' ? '/index.html' : '/'+currentPage+'.'+editorMode;
    console.log(path2+currentProject+filePath)
    shell.openExternal('file:///'+path2+currentProject+filePath);
    toggleDisplay('dropdown__menu--preview');
}

// TABS AND PAGES - INITIALISATION

function initCMcontainers(details) {
    //div container with id, class of 'editor' and style of z-index: 0;
    //make html containers
    let pages = details.pages;
    let container = document.getElementById('pages-container');

    for (let i = 0; i < pages.length; i++) {
        //div with page id+container
        let pageCont = document.createElement('div');
        pageCont.setAttribute('id', 'page-container-'+pages[i]);
        pageCont.setAttribute('style','z-index:0');       
        pageCont.setAttribute('class','editor');       
        //textarea with page id and style of: style="visibility: hidden; min-height: 1px;"
        let textArea = document.createElement('textarea');
        textArea.setAttribute('id','editor-'+pages[i]);   
        textArea.setAttribute('style','visibility: hidden; min-height: 1px;');
        
        pageCont.appendChild(textArea);
        container.appendChild(pageCont);   
    }

    // then make css page container
    let cssPageCont = document.createElement('div');
    cssPageCont.setAttribute('id', 'page-container-css');
    cssPageCont.setAttribute('style','z-index:0');       
    cssPageCont.setAttribute('class','editor');  
    let cssTextArea = document.createElement('textarea');
    cssTextArea.setAttribute('id','editor-css');   
    cssTextArea.setAttribute('style','visibility: hidden; min-height: 1px;');

    cssPageCont.appendChild(cssTextArea);
    container.appendChild(cssPageCont);   
}

function insertCmContainer(data) {
    let pages = data.pages;
    let container = document.getElementById('pages-container');
    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) {
            console.log(pages[i]);
            let pageCont = document.createElement('div');
            pageCont.setAttribute('id', 'page-container-'+pages[i]);
            pageCont.setAttribute('style','z-index:0');       
            pageCont.setAttribute('class','editor');       
            //textarea with page id and style of: style="visibility: hidden; min-height: 1px;"
            let textArea = document.createElement('textarea');
            textArea.setAttribute('id','editor-'+pages[i]);   
            textArea.setAttribute('style','visibility: hidden; min-height: 1px;');
            
            pageCont.appendChild(textArea);
            container.appendChild(pageCont);   
        }
    }
}

function initCMInstances(details) {
    let pages = details.pages;
    // HTML page settings:
    let htmlSpec = {
        lineNumbers: true,
        mode: 'xml',
        htmlMode: true,
        theme: 'lucario',
        lineWrapping: true,
        autoCloseTags: true,
        matchTags: true,
    }
    //instance for each page
    for (let i = 0; i < pages.length; i++) {
        let currentPageCont = document.getElementById('editor-'+pages[i]);
        let editor = CodeMirror.fromTextArea(currentPageCont, htmlSpec);
        editor.setSize("100%", "calc(100vh - 70px)");
        editors[pages[i]] = editor;
    }

    //then instance for css file
    //CSS page settings:
    let cssSpec = {
        lineNumbers: true,
        mode: 'css',
        theme: 'lucario',
        lineWrapping: true,
        autoCloseTags: true,
        matchTags: true,
    }

    let cssEditorCont = document.getElementById('editor-css');
    let cssEditor = CodeMirror.fromTextArea(cssEditorCont, cssSpec);
    cssEditor.setSize("100%", "calc(100vh - 70px)");
    editors[details.mode+'-'+details.layout] = cssEditor;
}

function newCmInstance(data) {
    let pages = data.pages;

    let htmlSpec = {
        lineNumbers: true,
        mode: 'xml',
        htmlMode: true,
        theme: 'lucario',
        lineWrapping: true,
        autoCloseTags: true,
        matchTags: true,
    }

    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) { 
            let currentPageCont = document.getElementById('editor-'+pages[i]);
            let editor = CodeMirror.fromTextArea(currentPageCont, htmlSpec);
            editor.setSize("100%", "calc(100vh - 70px)");
            editors[pages[i]] = editor;
        }
    }
}

function loadPageContent(details) {
    let pages = details.pages;
    for (let i = 0; i < pages.length; i++) {
        fs.readFile(savesPath+details.name+'/'+pages[i]+'.html','utf-8', (err, fileData) => {
            if (err) return console.log(err);
  /*           console.log(editors[pages[i]]); */
            editors[pages[i]].setValue(fileData)
            editors[pages[i]].clearHistory();
        });
    }
    fs.readFile(savesPath+details.name+'/css/text-default.css','utf-8', (err, fileData) => {
        if (err) return console.log(err);
        /* console.log(fileData) */
        editors["text-default"].setValue(fileData)
        editors["text-default"].clearHistory();
    });
}

function loadNewPageContent(details) {
    let pages = details.pages;
    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) {
            fs.readFile(savesPath+details.name+'/'+pages[i]+'.html','utf-8', (err, fileData) => {
                if (err) return console.log(err);
      /*           console.log(editors[pages[i]]); */
                editors[pages[i]].setValue(fileData)
                editors[pages[i]].clearHistory();
            });
        }
    }
}

function setTab(tabEls, currentTabId, pageId, curPage) {
    
    let tabs = document.querySelectorAll(tabEls);
    let curTab = document.querySelectorAll(currentTabId)[0];
    let page = document.querySelectorAll(pageId)[0];

    if (!curTab.classList.contains('active')) {
        curTab.classList.add('active');
        page.style = 'display: block';
        for(let i = 0; i < tabs.length; i++) {
            if (tabs[i] !== curTab) {
                tabs[i].classList.remove('active');
            }
        }
    }
    currentPage = curPage;
    currentEditor = curPage;
    currentPage === 'text-default' ? editorMode = 'css' : editorMode = 'html';
    hideOthers('.editor', page);
}

function initTabs(details) {
    //Dynamically create tabs based of pages
    let tabsList = document.getElementsByClassName('tabs')[0];
    let pages = details.pages;
    for (let i = 0; i < pages.length; i++) {
        let li = document.createElement('li');
        li.setAttribute('class', 'tab__item');
        li.setAttribute('id', pages[i]+'-tab__item');
        let button = document.createElement('button');
        button.setAttribute('id',pages[i]+'-tab-btn');
        button.setAttribute('class','tab-btn');
        let text = document.createTextNode(pages[i]+'.html');

        button.appendChild(text);
        li.appendChild(button);
        tabsList.appendChild(li);
    }

    // Make CSS tab
    let cssLi = document.createElement('li');
    cssLi.setAttribute('class', 'tab__item');
    let cssButton = document.createElement('button');
    cssButton.setAttribute('id','css-tab-btn');
    cssButton.setAttribute('class','tab-btn');
    let cssText = document.createTextNode('/css/text-default.css');

    cssButton.appendChild(cssText);
    cssLi.appendChild(cssButton);
    tabsList.appendChild(cssLi);

    initTabListeners(details);
}

function addNewTab(details) {
    let tabsList = document.getElementsByClassName('tabs')[0];
    let pages = details.pages;
    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) {
            let li = document.createElement('li');
            li.setAttribute('id', pages[i]+'-tab__item');
            li.setAttribute('class', 'tab__item');
            let button = document.createElement('button');
            button.setAttribute('id',pages[i]+'-tab-btn');
            button.setAttribute('class','tab-btn');
            let text = document.createTextNode(pages[i]+'.html');

            button.appendChild(text);
            li.appendChild(button);
            tabsList.appendChild(li);
        }
    }
    console.log(tabsList);
    initNewTabListener(details);
}

function initTabListeners(details) {

    let pages = details.pages;
   // Add listener to all html tabs
    if (pages.length > 0) {
        setTimeout(()=>{
            setTab('.tab-btn','#'+pages[0]+'-tab-btn', '#page-container-'+pages[0], pages[0]);
        },100);
        for (let i = 0; i < pages.length; i++) {
            let tab = document.getElementById(pages[i]+'-tab-btn');
            tab.addEventListener('click', (e) => {
                setTab('.tab-btn','#'+pages[i]+'-tab-btn', '#page-container-'+pages[i], pages[i]);
            });
        }
    }
    
    // Add listener to css tab
    let cssTab = document.getElementById('css-tab-btn');
    cssTab.addEventListener('click', (e) => {
        setTab('.tab-btn','#css-tab-btn', '#page-container-css', 'text-default');
    });

}

function initNewTabListener(details) {
    let pages = details.pages;
    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) {
            let tab = document.getElementById(pages[i]+'-tab-btn');
            tab.addEventListener('click', (e) => {
                setTab('.tab-btn','#'+pages[i]+'-tab-btn', '#page-container-'+pages[i], pages[i]);
            });
            setTab('.tab-btn','#'+pages[i]+'-tab-btn', '#page-container-'+pages[i], pages[i]);
        }
    }
}

function updateCurProjectDetails(data) {
    let pages = data.pages;
    for (let i = 0; i < pages.length; i++) {
        if (curProjectDetails.pages.indexOf(pages[i]) === -1) {
            curProjectDetails.pages.push(pages[i]);
        }
    }
}

function saveChanges(currentProject) {
    console.log('saving')
    let changes = editors[currentEditor].getValue();
    let data = {
        name: currentProject,
        file: currentPage+'.'+editorMode,//this is hardcoded for now (will be context based later)
        content: changes
    }
    ipcRenderer.send('save:file', data)
    toggleDisplay('dropdown__menu--file');
}



