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
    console.log('element:',el,'class to add:',className)
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



