function highlighter(step) {
    const iframe = document.querySelectorAll('iframe')[0];
    const iframeDoc = iframe.contentWindow.document;
    const shadow = 'box-shadow: inset 0 0 10px #55fc85';
    
    if (curProjectDetails.layout === 'layout1') {

        switch(step) {
            case 'step-header':
                let header = iframeDoc.getElementsByTagName('header')[0];
                header.style = shadow;
                header.scrollIntoView();
                removeShadow(header);
                break;
            case 'step-navigation':
                let nav = iframeDoc.getElementsByTagName('nav')[0];
                nav.style = shadow;
                nav.scrollIntoView();
                removeShadow(nav);
                break;
            case 'step-main':
                let main = iframeDoc.getElementById('main-article');
                main.style = shadow;
                main.scrollIntoView();
                removeShadow(main);
                break;
            case 'step-column':
                let cols = iframeDoc.getElementById('columns');
                cols.style = shadow;
                cols.scrollIntoView();
                removeShadow(cols);
                break;
            case 'step-secondary':
                let secondary = iframeDoc.getElementById('secondary');
                secondary.style = shadow;
                secondary.scrollIntoView();
                removeShadow(secondary);
                break;
            case 'step-footer':
                let footer = iframeDoc.getElementsByTagName('footer')[0];
                footer.style = shadow;
                footer.scrollIntoView();
                removeShadow(footer);
                break;
            default:
                break;
        }
    } else if (curProjectDetails.layout === 'layout2') {
        switch(step) {
            case 'step-header':
                let header = iframeDoc.getElementsByTagName('header')[0];
                header.style = shadow;
                header.scrollIntoView();
                removeShadow(header);
                break;
            case 'step-navigation':
                let nav = iframeDoc.getElementsByTagName('nav')[0];
                nav.style = shadow;
                nav.scrollIntoView();
                removeShadow(nav);
                break;
            case 'step-main':
                let main = iframeDoc.getElementById('main-article');
                main.style = shadow;
                main.scrollIntoView();
                removeShadow(main);
                break;
            case 'step-column':
                let cols = iframeDoc.getElementById('columns');
                cols.style = shadow;
                cols.scrollIntoView();
                removeShadow(cols);
                break;
            case 'step-secondary':
                let secondary = iframeDoc.getElementById('secondary');
                secondary.style = shadow;
                secondary.scrollIntoView();
                removeShadow(secondary);
                break;
            case 'step-footer':
                let footer = iframeDoc.getElementsByTagName('footer')[0];
                footer.style = shadow;
                footer.scrollIntoView();
                removeShadow(footer);
                break;
            default:
                break;
        }
    }
}

function removeShadow(keep) {
    const iframe = document.querySelectorAll('iframe')[0];
    const iframeDoc = iframe.contentWindow.document;

    const removeEls = iframeDoc.querySelectorAll('*');
    for (let i = 0; i < removeEls.length; i++) {
        if (removeEls[i] !== keep) {
            removeEls[i].style = "box-shadow: 0;";
        }
    }
}

function initSteps() {
    let steps = document.querySelectorAll('.gui-step');
    for (let i = 0; i < steps.length; i++) {
        steps[i].addEventListener('click', (e) => {

            addClass(e.target,'active');
            curStep = steps[i].id;
            highlighter(steps[i].id);

            for (let j = 0; j < steps.length; j++) {
                if (e.target !== steps[j]) {
                    removeClass(steps[j], 'active');
                }
            }
        });
    }
}

function initStepInputListener() {
    let inputs = document.querySelectorAll('.gui-step');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('focus', () => {
            /* toggleDisplay('dictate-btn'); */
            console.log('input clicked')
            addClass('#dictate-btn', 'ready');
        });

        inputs[i].addEventListener('blur', () => {
            /* toggleDisplay('dictate-btn'); */
            removeClass('#dictate-btn', 'ready');
            stopRecording();
        });

    }
}


function initGuiDictate() {
    const speechPath = path.join(app.getPath('documents'),'Voice Developer Projects','/speech/test.wav');
    let active = false;

    const dictate = document.getElementById('dictate-btn');
    let frame = '.CodeMirror';
    let gutter = '.gutter';
    let main = document.getElementsByTagName('main')[0];
    

    dictate.addEventListener('mousedown', (e) => {
        e.preventDefault();
        // If not already recording, set to active on mousedown
        if (!active) {
            toggleClass(dictate, 'active');
            if (document.getElementsByTagName('body')[0].classList.contains('text-editor')) {
                // Handle visual indication
                toggleClass(frame, 'shadow-positive');
            } else {
                // Handle visual indication
                toggleClass(main, 'shadow-positive');
            }
            // Start recording
            startRecording(speechPath);
        } else {
            // If already recording, stop recording on mousedown and remove active state
            stopRecording();
            toggleClass(dictate, 'active');
            // Handle visual indication of recording stopped
            if (document.getElementsByTagName('body')[0].classList.contains('text-editor')) {
                toggleClass(frame, 'shadow-positive');
                toggleClass(frame, 'working');
            } else {
                toggleClass(main, 'shadow-positive');
                toggleClass(main, 'working');
            }
            // Now that recording has finished send data from speechPath file to speech to text promise which will return the text as 'data'
            toText(speechPath).then((data) => {
                    speechToGui(data);
            });
        }
        !active ? active = true : active = false;
    });

    initStepInputListener();
}

function findKeyNameOfValue(array, data) {
    // This only works for [{key:['value','value1']},{['value','value1']}] data structure
    // Search through array of objects and for each key (e.g. 'div' or 'main') in each object search through it's values
    for (let i = 0; i < array.length; i++) {
        // For every object in array, loop through it's keys
    /*     console.log(array[i]); */
        for (let key in array[i]) {
         /*    console.log(array[i][key]); */
            // For every key in the current object loop through that keys values
            for (let j = 0; j < array[i][key].length; j++) {
  /*               console.log(array[i][key][j], data) */
                // For every value in the current key check against data input value
                if (array[i][key][j] === data) {
                    // If a value matches the data given then return the name of the key as a string
                    return key;
                }
            }
        }
    }
}

function findMatchingValue(array, string) {
    for (let i = 0; i < array.length; i ++) {
        // Loop through command objects
        for (let key in array[i]) {
            // For each key in current command object look through keys values
            for (let j = 0; j < array[i][key].length; j++) {
                // If the current key value exists in the data string return key using findKeyNameOfValue?
                if (string.indexOf(array[i][key][j]) !== -1) {
                    return array[i][key][j];                    
                }
            }
        }
    }
}

const commands = [
    {"text color": ["text color", "text colour"]},
    {"text size": ["text size"]},
    {"title color": ["title color", "title colour"]},
    {"title size": ["itle size"]},
    {"background color": ["background color", "background colour"]},
    {"image size": ["image size"]},
    {"select image": ["select image"]}
];




function speechToGui(data) {
    let guiSpeechSuccess = false;

    let frame = '.CodeMirror';
    let gutter = '.gutter';

    // Logic to evaluate data and work out which command to process
    let words = data.toLowerCase().split(" ");
    let string = data.toLowerCase();
    if (curProjectDetails.layout === 'layout1') {
        console.log(curStep);
        switch(curStep) {
            case 'step-header':
                for (let word in words) {
                    console.log('header-step words:', words[word]);
                    
                }
                console.log(string);
                console.log(string.indexOf("color"));
                break;
            case 'step-navigation':
                for (let word in words) {
                    console.log('navigation-step words:', words[word]);
                }
                break;
            case 'step-main':
                for (let word in words) {
                    console.log('main-step words:', words[word]);
                }
                break;
            case 'step-column':
                for (let word in words) {
                    console.log('column-step words:', words[word]);
                }
                break;
            case 'step-footer':
                for (let word in words) {
                    console.log('footer-step words:', words[word]);
                }
                break;
            default:
                break;
        }
    }
    
    if (curProjectDetails.layout === 'layout2') {
        console.log(curStep);
        switch(curStep) {
            case 'step-header':
                let newCommand = findKeyNameOfValue(commands, findMatchingValue(commands, string));
                processCommand(newCommand, string, 'header');
                break;
            case 'step-navigation':
                for (let word in words) {
                    console.log('navigation-step words:', words[word]);
                }
                break;
            case 'step-main':
                for (let word in words) {
                    console.log('main-step words:', words[word]);
                }
                break;
            case 'step-column':
                for (let word in words) {
                    console.log('column-step words:', words[word]);
                }
                break;
            case 'step-footer':
                for (let word in words) {
                    console.log('footer-step words:', words[word]);
                }
                break;
            default:
                break;
        }
    }

    // If command matches are made set 'guiSpeechSuccess' to 'true'

    // Confirmation of finished
    toggleClass(frame, 'working');
    //console.log(guiSpeechSuccess)
    if (guiSpeechSuccess && guiSpeechSuccess !== undefined) {
        //console.log('success', data.length)
        toggleClass(frame, 'finished');
        setTimeout(()=>{
            toggleClass(frame, 'finished');
        },1000);  
    } else {
        //console.log('failure', data.length)
        toggleClass(frame, 'error');
        setTimeout(()=>{
            toggleClass(frame, 'error');
            toggleClass(gutter, 'error');
        },1000);    
    }
}

function processCommand(command, string, rule) {
    const iframe = document.querySelectorAll('iframe')[0];
    const iframeDoc = iframe.contentWindow.document;

    let textEls = ['p','h1','h2','h3','h4','h5','h6'];
    let titleEls = ['h1','h2','h3','h4','h5','h6'];
    
    /* let process = command.replace(' ', '-');
    console.log(process); */
    switch(command) {
        case 'text color':
            // Get command parameters
            let newString = findKeyNameOfValue(colors, findMatchingValue(colors, string));
            console.log(newString);
            // Change in DOM
            for (let i = 0; i < textEls.length; i++) {
                let text = iframeDoc.querySelectorAll('header '+textEls[i]);
                for (let j = 0; j < text.length; j++) {
                    let prop = 'color';
                    let propVal = newString;
                    insertCSS(rule, prop, propVal);
                }
            }
            break;
        default:
            break;
    }
}

function cssContains(string, list) {
    // Look through all strings in the given list
    for (let i = 0; i < list.length; i++) {
        console.log(list[i].cssText, string);
        if (list[i].cssText.indexOf(string) !== -1) {
            return list[i]; // If string input found in a list item's string return that list item
        }
    }
}


function insertCSS(rule, prop, propVal) {
    let iframe = document.querySelectorAll('iframe')[0];
    let iframeDoc = iframe.contentWindow.document;
    let stylesheet = iframeDoc.styleSheets[0];
    let rules = stylesheet.cssRules;

    if (cssContains(rule, rules)) {
        // If rule exists in list of rules return that rule as 'index' and update that rule with the given property and values
        let index = cssContains(rule, rules)
        index.style[prop] = propVal;
    } else {
        // If rule doesn't exist in list of rules, create a new rule and set property and property value, appending to the bottom of the stylesheet
        stylesheet.insertRule(rule +'{'+prop+':'+propVal+';}', rules.length);
    }
}


function saveComputedCSS() {
    let iframe = document.querySelectorAll('iframe')[0];
    let iframeDoc = iframe.contentWindow.document;
    let styleRules = iframeDoc.styleSheets[0].cssRules;
    
    let cssCont = '';

    for (let i = 0; i < styleRules.length; i++) {
        cssCont = cssCont.concat(styleRules[i].cssText+'\n\n');

    }
    
    fs.writeFile(path.join(savesPath+currentProject+'/css/'+curProjectDetails.mode+'-'+curProjectDetails.layout+'.css'), cssBeauty(cssCont), (err) => {
        if (err) console.log(err);
    });
    toggleDisplay('dropdown__menu--file');
}