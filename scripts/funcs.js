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
            editor.doc.undo();
            toggleDisplay('dropdown__menu--edit');
        });

        let redoBtn = document.getElementById('redobtn');
        redoBtn.addEventListener('click', () => {
            editor.doc.redo();
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
            CodeMirror.commands.newlineAndIndent(editor);
            toggleDisplay('dropdown__menu--edit');
        });

        let tabBtn = document.getElementById('tabbtn');
        tabBtn.addEventListener('click', () => {
            CodeMirror.commands.defaultTab(editor);
            toggleDisplay('dropdown__menu--edit');
        });

        let spaceBtn = document.getElementById('spacebtn');
        spaceBtn.addEventListener('click', () => {
            let cursorPos = editor.getCursor();
            editor.replaceRange(" ",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--edit');
        });

        //Preview Menu
        let previewBtn = document.getElementById('previewbtn');
        previewBtn.addEventListener('click', () => {
            let path = savesPath.replace(/\\/g, "/");
            let path2 = path.replace(/\s+/g, '%20');
            shell.openExternal('file:///'+path2+currentProject+'/index.html');
            toggleDisplay('dropdown__menu--preview');
        })

        //Tags Menu
        let heading1 = document.getElementById('heading1btn');
        heading1.addEventListener('click', () => {
            let cursorPos = editor.getCursor();
            editor.replaceRange("<h1></h1>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });

        let heading2 = document.getElementById('heading2btn');
        heading2.addEventListener('click', () => {
            let cursorPos = editor.getCursor();
            editor.replaceRange("<h2></h2>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });

        let heading3 = document.getElementById('heading3btn');
        heading3.addEventListener('click', () => {
            let cursorPos = editor.getCursor();
            editor.replaceRange("<h3></h3>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });

        let heading4 = document.getElementById('heading4btn');
        heading4.addEventListener('click', () => {
            let cursorPos = editor.getCursor();
            editor.replaceRange("<h4></h4>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });

        let heading5 = document.getElementById('heading5btn');
        heading5.addEventListener('click', () => {
            let cursorPos = editor.getCursor();
            editor.replaceRange("<h5></h5>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });

        let heading6 = document.getElementById('heading6btn');
        heading6.addEventListener('click', () => {
            let cursorPos = editor.getCursor();
            editor.replaceRange("<h6></h6>",{line: cursorPos.line, ch: cursorPos.ch});
            toggleDisplay('dropdown__menu--tags');
        });
}


function setTab(tabEls, currentTabId, pageId) {
    let tabs = document.querySelectorAll(tabEls);
    let curTab = document.querySelectorAll(currentTabId)[0];
    console.log(curTab)
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
    hideOthers('.editor', page);
}

function initTabs() {
    
    // Index tab
    let indexTab = document.getElementById('indextab-btn');
    setTimeout(() => {
        setTab('.tab-btn', '#indextab-btn', '#editor');
    },50);
    indexTab.addEventListener('click', (e) => {
        setTab('.tab-btn', '#indextab-btn', '#editor');
    });

    // CSS tab
    let cssTab = document.getElementById('csstab-btn');
    cssTab.addEventListener('click', () => {
        setTab('.tab-btn', '#csstab-btn', '#csseditor')
    });

    
}

function saveChanges(currentProject) {
    console.log('saving')
    let changes = editor.getValue()
    let data = {
        name: currentProject,
        file: 'index.html',//this is hardcoded for now (will be context based later)
        content: changes
    }
    ipcRenderer.send('save:file', data)
    toggleDisplay('dropdown__menu--file');
}



