const commands = [
    {"text color": ["text color", "text colour"]},
    {"text size": ["text size", "font size"]},
    {"title color": ["title color", "title colour"]},
    {"link color": ["link color", "link colour", "lynn color", "links color"]},
    {"link size": ["link size", "lynn size", "links size"]},
    {"title size": ["title size", "total size"]},
    {"background color": ["background color", "background colour"]},
    {"image size": ["image size"]},
    {"select image": ["select image", "select an image", "select the image"]},
    {"save": ["save"]},
    {"preview": ["preview"]},
    {"new text":["new text", "new tax"]},
    {"update text":["update text", "change text"]}
];

const sizes = [
    {"large": ["large"]},
    {"normal": ["normal","medium"]},
    {"small": ["small"]}
]

let html;

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

function loadHtmlText() {
    fs.readFile(path.join(savesPath, curProjectDetails.name,'/index.html'), (err, data) => {
        html = data;
    });
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

    let textareas = document.querySelectorAll('textarea');
    console.log(textareas[0]);
    for (let i = 0; i < textareas.length; i++) {
        textareas[i].addEventListener('focus', () => {
            addClass('#dictate-btn', 'ready');
            dictateMode = 'plaintext';
        });

        textareas[i].addEventListener('blur', () => {
            removeClass('#dictate-btn', 'ready');
            dictateMode = 'default';
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
                    console.log('command/key',key);
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
                if (string.search('\\b'+array[i][key][j]+'\\b') !== -1) {
                    console.log('matched value',array[i][key][j]);
                    return array[i][key][j];                    
                }
            }
        }
    }
}




function speechToGui(data) {
    let guiSpeechSuccess = false;

    let frame = '.CodeMirror';
    let gutter = '.gutter';

    // Logic to evaluate data and work out which command to process
    let words = data.toLowerCase().split(" ");
    let string = data.toLowerCase();
    console.log(dictateMode);
    if (dictateMode === "plaintext") {
        if (data.length > 0) {
            document.activeElement.value = data;
            successFail('finished');

        }
    } else {
        let newCommand;
        console.log(curStep);
        switch(curStep) {
            case 'step-header':
                newCommand = findKeyNameOfValue(commands, findMatchingValue(commands, string));
                processCommand(newCommand, string, 'header');
                break;
            case 'step-navigation':
                newCommand = findKeyNameOfValue(commands, findMatchingValue(commands, string));
                processCommand(newCommand, string, '.mainnav');
                break;
            case 'step-main':
                newCommand = findKeyNameOfValue(commands, findMatchingValue(commands, string));
                processCommand(newCommand, string, '#main-article');
                break;
            case 'step-column':
                newCommand = findKeyNameOfValue(commands, findMatchingValue(commands, string));
                processCommand(newCommand, string, '#columns');
                break;
            case 'step-secondary':
                newCommand = findKeyNameOfValue(commands, findMatchingValue(commands, string));
                processCommand(newCommand, string, '#secondary');
                break;
            case 'step-footer':
                newCommand = findKeyNameOfValue(commands, findMatchingValue(commands, string));
                processCommand(newCommand, string, 'footer');
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
    let main = document.getElementsByTagName('main')[0];

    /* let process = command.replace(' ', '-');
    console.log(process); */
    let newString;
    let headings = ['h1', 'h2', 'h3', 'h4', 'h6'];
    switch(command) {
        case 'background color':
            // Get command parameters
            newString = findKeyNameOfValue(colors, findMatchingValue(colors, string));
            // Change in DOM
            applyCSS(rule, 'background-color', newString);
            
            break;
        case 'text color':
            // Get command parameters
            newString = findKeyNameOfValue(colors, findMatchingValue(colors, string));
            // Change in DOM
            applyCSS(rule + ' p', 'color', newString);
            
            break;
        case 'link color':
            // Get command parameters
            newString = findKeyNameOfValue(colors, findMatchingValue(colors, string));
            // Change in DOM
            
            applyCSS(rule + ' a', 'color', newString+' !important');
        break;
        case 'title color':
            // Get command parameters
            newString = findKeyNameOfValue(colors, findMatchingValue(colors, string));
            // Change in DOM
            for (let i = 0; i < headings.length; i++){
                applyCSS(rule + ' ' + headings[i], 'color', newString);
            }
        break;
        case 'title size':
            // Get command parameters
            newString = findKeyNameOfValue(sizes, findMatchingValue(sizes, string));
            // Change in DOM
            switch(newString) {
                case 'large':
                    let container = iframeDoc.querySelectorAll(rule)[0];
                    console.log(container.children)
                    newString = "3em";
                    break;
                case 'normal':
                    newString = "2em";
                    break;
                case 'small':
                    newString = "1.5em";
                    break;
                default:
                    break;
            }
            for (let i = 0; i < headings.length; i++){
                applyCSS(rule + ' ' + headings[i], 'font-size', newString);
            }
        break;
        case 'text size':
            // Get command parameters
            newString = findKeyNameOfValue(sizes, findMatchingValue(sizes, string));
            // Change in DOM
            switch(newString) {
                case 'large':
                    newString = "1.25em";
                    break;
                case 'normal':
                    newString = "1em";
                    break;
                case 'small':
                    newString = "0.8em";
                    break;
                default:
                    break;
            }
            applyCSS(rule + ' p', 'font-size', newString);
            
        break;
        case 'link size':
            // Get command parameters
            newString = findKeyNameOfValue(sizes, findMatchingValue(sizes, string));
            // Change in DOM
            switch(newString) {
                case 'large':
                    newString = "1.25em";
                    break;
                case 'normal':
                    newString = "1em";
                    break;
                case 'small':
                    newString = "0.8em";
                    break;
                default:
                    break;
            }
            applyCSS(rule + ' a', 'font-size', newString);
            
        break;
        case "select image":
            console.log('select image ahahahha');

            // Options for image selection dialoge
            let dialogOptionsImg = {
                defaultPath: path.join(savesPath,curProjectDetails.name),
                properties: ['openFile'],
                filters: [
                    { name: 'Images', extensions: ['jpg', 'png', 'gif', 'svg'] }
                ]
            }
            let page = document.getElementsByTagName('html')[0];
            page.classList.add("disabled");
            dialog.showOpenDialog(dialogOptionsImg, (data)=>{
                if (data === undefined) {
                    console.log('Error, path not found');
                    page.classList.remove("disabled");
                    successFail('error');
                };
                let image = iframeDoc.querySelectorAll(rule + ' img')[0];
                console.log(image.src)
                let imageSrc = fileNameFromPath(image.src, 'src');
                let file = fileNameFromPath(data[0]);
                let newPath = path.join(savesPath,curProjectDetails.name,'/img/',file);
                // Copy selected image to project save location
                copyImage(data[0], newPath);
                // Set image src to new copied image
                
                var checkExists = setInterval(() => {
                    console.log('checking for file exist');
                    if (fs.existsSync(newPath)) {
                        image.src = path.join(newPath);
                        page.classList.remove("disabled");
                        clearInterval(checkExists);
                    }
                }, 100);
                

                // Update html with new src
                fs.readFile(path.join(savesPath, curProjectDetails.name, 'index.html'), 'utf-8', (err, data) => {
                    if (err) console.log(err);
                    console.log(imageSrc, file);
                    html = data.replace(imageSrc, file);
                    
                    successFail('finished');
                }); 

                
            });
            break;
        case "save":
            saveProject();
            break;
        case "preview":
            saveProject();
            pagePreview();
            break;
        case "new text":
            toggleDisplay('newtext__container');
            break;
        case "update text":
            toggleDisplay('updatetext__container');
            break;
        default:
            successFail('error');
            break;
    }
}

function fileNameFromPath(path, type) {
    console.log(path, type);
    let dataArray = type === "src" ? path.split('/') : path.split("\\");
    console.log(dataArray);
    let file = dataArray[dataArray.length - 1];
    return file;
}

function applyCSS(rule, prop, propVal) {
    console.log(rule);
    if (propVal === undefined) {
        let main = document.getElementsByTagName('main')[0];
        successFail('error'); 
        return;
    }

    const iframe = document.querySelectorAll('iframe')[0];
    const iframeDoc = iframe.contentWindow.document;
    let text = iframeDoc.querySelectorAll(rule);
    console.log(rule, text[0])
    for (let j = 0; j < text.length; j++) {
        insertCSS(rule, prop, propVal);
    }
}

function cssContains(string, list) {
    // Look through all strings in the given list
    for (let i = 0; i < list.length; i++) {
        let getrule = list[i].cssText.split('{');
        let existingRule = getrule[0];
        //console.log('existingrule',existingRule, 'string',string);
        if (existingRule.replace(/\s/g, '') === string.replace(/\s/g, '')) {
            console.log('rule exists')
            return list[i];
        }
        /* if (list[i].cssText.indexOf(string) !== -1) {
            return list[i]; // If string input found in a list item's string return that list item
        } */
    }
}


function insertCSS(rule, prop, propVal) {
    let iframe = document.querySelectorAll('iframe')[0];
    let iframeDoc = iframe.contentWindow.document;
    let stylesheet = iframeDoc.styleSheets[0];
    let rules = stylesheet.cssRules;
    
    console.log(rule);
    if (cssContains(rule, rules)) {
        console.log('fudge')
        // If rule exists in list of rules return that rule as 'index' and update that rule with the given property and values
        let index = cssContains(rule, rules)
        console.log(index);
        console.log(prop, propVal)
        index.style[prop] = propVal;
        successFail('finished');
    } else {
        console.log('muffin')
        // If rule doesn't exist in list of rules, create a new rule and set property and property value, appending to the bottom of the stylesheet
        stylesheet.insertRule(rule +'{'+prop+':'+propVal+';}', rules.length);
        successFail('finished');
    }
}

function successFail(string) {
    let main = document.getElementsByTagName('main')[0];
    toggleClass(main, 'working');
    toggleClass(main, string);
    setTimeout(()=>{
        toggleClass(main, string);
    },1000);  
}

function saveProject() {
    saveComputedCSS();
    saveHtml(html);
}

function saveHtml(html) {
    // get new content and replace it in html string
    let iframe = document.querySelectorAll('iframe')[0];
    let iframeDoc = iframe.contentWindow.document;
    let inner = iframeDoc.documentElement.innerHTML;
    let one = `<!DOCTYPE html>
    <html lang="en">`;
    let two = `</html>`
    let content = one.concat(inner, two);
    content = content.replace('style="box-shadow: rgb(85, 252, 133) 0px 0px 10px inset;"', '');
    console.log(content);


    fs.writeFile(path.join(savesPath,curProjectDetails.name,'/index.html'), content, (err) => {
        if (err) console.log(err);
        console.log('html updated');
    });
}

function saveComputedCSS() {
    let iframe = document.querySelectorAll('iframe')[0];
    let iframeDoc = iframe.contentWindow.document;
    let styleRules = iframeDoc.styleSheets[0].cssRules;
    let fileMenu = document.getElementById('dropdown__menu--file');
    let previewMenu = document.getElementById('dropdown__menu--preview');
    
    let cssCont = '';

    for (let i = 0; i < styleRules.length; i++) {
        cssCont = cssCont.concat(styleRules[i].cssText+'\n\n');

    }
    
    fs.writeFile(path.join(savesPath+currentProject+'/css/'+curProjectDetails.mode+'-'+curProjectDetails.layout+'.css'), cssBeauty(cssCont), (err) => {
        if (err) console.log(err);
    });
    
    if (fileMenu.style.display === 'block') {
        fileMenu.style.display = 'none';
    }
    if (previewMenu.style.display === 'block') {
        previewMenu.style.display = 'none';
    }
}