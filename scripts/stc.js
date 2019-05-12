// Initiate dictate button/function on target i.e. text editor or general UI input
// If in text editor then pass through to a different function that processes the text
let dictateMode = 'default';

function initInputListeners() {
    let textInputs = document.querySelectorAll('input[type=text]');
    for (let i = 0; i < textInputs.length; i++) {
        textInputs[i].addEventListener('focus', () => {
            /* toggleDisplay('dictate-btn'); */
            addClass('#dictate-btn', 'ready');
        });

        textInputs[i].addEventListener('blur', () => {
            /* toggleDisplay('dictate-btn'); */
            removeClass('#dictate-btn', 'ready');
            stopRecording();
        });

    }
    
    let textAreas = document.getElementsByTagName('textarea');
    for (let i = 0; i < textAreas.length; i++) {
        textAreas[i].addEventListener('focus', () => {
            /* toggleDisplay('dictate-btn'); */
            addClass('#dictate-btn', 'ready');
        });

        textAreas[i].addEventListener('blur', () => {
            /* toggleDisplay('dictate-btn'); */
            removeClass('#dictate-btn', 'ready');
            stopRecording();
        });
    }
}


function initDictate(target) {
    const speechPath = path.join(app.getPath('documents'),'Voice Developer Projects','/speech/test.wav');
    let active = false;

    const dictate = document.getElementById('dictate-btn');
    let frame = '.CodeMirror';
    let gutter = '.gutter';
    let main = document.getElementsByTagName('main')[0];
    

    dictate.addEventListener('mousedown', (e) => {
        e.preventDefault();
        switch(e.which) {
            case 1:
                dictateMode = 'markup';
                /* console.log('left mouse',e.which); */
                break;
            case 2:
                dictateMode = 'command';
                /* console.log('middle mouse',e.which); */
                break;
            case 3:
                dictateMode = 'plaintext';
                /* console.log('right mouse',e.which); */
                break;
            default: 
             dictateMode = 'default';
        } 
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
                if (target === 'textEditor') {
                    speechToCode(data);
                } else { // If not textEditor insert as regular text
                    toggleClass(main, 'working');
                    if (data || data.length > 0) {
                        toggleClass(main, 'finished');
                        document.activeElement.value = data;
                        setTimeout(()=>{
                            toggleClass(main, 'finished');
                        },1000);  
                    } else {
                        toggleClass(main, 'error');
                        document.activeElement.value = data;
                        setTimeout(()=>{
                            toggleClass(main, 'error');
                        },1000);      
                    }
                }
            });
        }
        !active ? active = true : active = false;
    });

    initInputListeners();
}


//potentially have 'tags' etcl. as an individual json file and add option to add words to the appropriate key so that the app learns

// possible words that could be intended as 'tag'
let couldBeTag = [
    {'tag':['tag',
        'tags',
        'attack',
        'had',
        'tack',
        'pack',
        'tagged',
        'thank',
        'tank',
        'tak',
        'tax',
        'contain',
        'container',
        "containing",
        "contender",
        "compiler",
        "taco",
        "taylor",
        'tach'
    ]}
]

/* let couldBeClass = [
    {'class':['class', 'close']}
] */

let couldBeAttr = [
    {'attribute':['attribute', 'attributes','tribute', 'a tribute', 'treatment', 'contribute']}
]

let couldBeAttrVal = [
    {'attribute-value':["attribute value"]}
]

let attrVals = [
    {'GET':["get"]},
    {'POST':["post"]},
    {'background: ;': ["background", "back ground"]},
    {'background-color: ;': ["background color", "background colour"]},
    {'multipart/form-data': ["multi part for data", "multi part forms data", "multi part foam data"]},
    {'true': ["true", "drew"]},
    {'false': ["false", 'force', 'forced']},
    {'_blank': ["blank"]},
    {'UTF-8': ["utf eight", "etf eight"]}, // test from this and down
    {"viewport": ["viewport", "newport", "the eu court", "view port"]}, 
    {"text/css": ["text css", "test css"]},
    {"text/javascript":["text javascript", "text java script", "test javascript", "test java script"]}
];

let couldBeCSSProp = [
    {"cssprop":["property"]}
];

let couldBeCSSTag = [{"csstag": [
    "css tag",
    "style tag",
    'style tag',
    'style tags',
    'style attack',
    'style had',
    'style tack',
    'style pack',
    'style tagged',
    'style thank',
    'style tank',
    'style tak',
    'style tax',
    'style contain',
    'style container',
    "style containing",
    "style contender",
    "style compiler",
    "style taco",
    "style taylor",
    'style tach'
]}];

let couldBeCSSId = [
    {"cssid":[
        "css i d",
        "css id",
        "style i d",
        "style id",
        "css id",
        "style in the",
        "css in the",
        "style i the",
        "css by the",
        "c s s i d",
        "css i the",
        "style i the",
        "style like the",
        "i d",
        "id",
        'i the',
        "in the",
        "i'd be",
        "i see",
        "i need",
        "i'm sorry to see it as"
    ]}
];

let couldBeCSSClass = [
    {"cssclass":[
        "css class",
        "style class",
        "c s s class",
        "stoke class",
        "style and class",
        "spiral class",
        "class"
    ]}
]

let couldBeCSSPseudo = [
    {"pseudo":["pseudo","sudo", "to go", "super", "sooner", "soon", "you know", "zero", "sudan", "to the", "see the", "sure how", "sue the", "judo"]}
]

let couldBeCSSValue = [
    {"cssvalue":[
        "css value",
        "style value",
        "c s s value",
        "css ballew",
        "stoke value",
        "style and value",
        "spiral value",
        "value",
        "star value",
        "simon by your",
        "star well you",
        "style while you",
        "since the new", 
        "since as well",
        "style by a new",
        "hostile ballew",
        "css family", 
        "css well",
        "css ali", 
        "css bali",
        "see it as value",
        "trial by the",
        "the new",
        "are you",
        "css hunley",
        "so i",
        "css belief",
        "yes as well",
        "says charlie",
        "css valley",
        "seasons value",
        "sisters are doing this",
        "stop by the",
        "see is the least",
        "css alan", 
        "style but the",
    ]}
]

//might need to make commands to make '<' and '>'
let commands = [
    {'space':['space']},
    {'cut':['cut','scott']},
    {'delete':['delete']},
    {'copy':['copy']},
    {'paste':['paste','post']},
    {'save':['save']},
    {'exit':['exit','close','closed','except']},
    {'undo':['undo', 'reverse', 'reversed', 'un do', 'one do', 'one two', 'and do', 'on to', 'scratch that', 'on the']},
    {'redo':['redo','radio', 'redial','forward', 're do', 'we do']},
    {'tab':['tab','tampa','tam','tap']},
    {'enter':['enter','line', 'new line', "new life"]},
    {'preview':['preview', 'previous']},
    {'period':['period']},
    {'hash': ['hash']},
    {'source': ['source', 'file path', 'file perth','file past', 'file location']},
    {"color-picker":["color picker", "coloca", "coaker"]},
    {"value-tool":["value tool","value to", "values tool","value to all", "well you could", "value to your", "value to our", "alioto", "valued who", "value cool", "valuable"]},
    //CHECK THESE
    {"select-all":["select all"]}

]


// List of HTML tags that don't need a closing tag
// Compare the keys in tags list against this list of singletons
let singletons = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    '!-- --',
    'area'
];

let booleanAttribute = [
    'required',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'contenteditable',
    'controls',
    'disabled',
    'hidden',
    'ismap',
    'multiple',
    'muted',
    'open',
    "readonly",
    "sandbox",
    'default'
]

function findKeyNameOfValue(array, data) {
    // This only works for [{key:['value','value1']},{['value','value1']}] data structure
    // Search through array of objects and for each key (e.g. 'div' or 'main') in each object search through it's values
    for (let i = 0; i < array.length; i++) {
        // For every object in array, loop through it's keys
        for (let key in array[i]) {
            // For every key in the current object loop through that keys values
            for (let j = 0; j < array[i][key].length; j++){
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
    console.log(string)
    string = string.toLowerCase();
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

function insertTagIndent(tag, cursorPos) {
    // Insert Opening tag   
    editors[currentEditor].replaceRange("<"+tag+">",{line: cursorPos.line, ch: cursorPos.ch});
    CodeMirror.commands.indentAuto(editors[currentEditor]); // Auto indent opening tab
    CodeMirror.commands.newlineAndIndent(editors[currentEditor]); // Simulate Enter key
    
    // Get cursor position to return to after insertion
    let cursorPosfinal = editors[currentEditor].getCursor(); 
    CodeMirror.commands.newlineAndIndent(editors[currentEditor]); // Simulate Enter key for closing tag position
    let cursorPos2 = editors[currentEditor].getCursor();  // Get new position for closing tag 

    // Insert Closing tag
    editors[currentEditor].replaceRange("</"+tag+">",{line: cursorPos2.line, ch: cursorPos2.ch});     
    CodeMirror.commands.indentAuto(editors[currentEditor]); // Auto Indet closing tag
    editors[currentEditor].setCursor(cursorPosfinal.line,cursorPosfinal.ch) // Set cursor back to final position between two tags
}

function stripStringCSS(data) {
    //Function to strip a string intended for css
    data = data.replace(".","");
    console.log("removed '.'" ,data)
    data = data.replace(",","");
    console.log("removed ','" ,data)
    data = data.trim();
    console.log("trimmed" ,data)
    data = data.replace(/\s/g, "-");
    console.log("replaced spaces with '-'" ,data)
    return data;
}

function speechToCode(data) {
    let stcSuccess = false;
    // Might need to track modes i.e. Text entry | html | css/styles (html or css could be set by active editor) text entry can be triggered by command or alternative click/right click?
    let cursorPos = editors[currentEditor].getCursor();
    /* let words = data.toLowerCase().split(" "); */
    // Get elements for "working..." indication/feedback    

    let frame = '.CodeMirror';
    let gutter = '.gutter';
    if (editorMode === 'css') {
                
        if ('cssclass' === findKeyNameOfValue(couldBeCSSClass, findMatchingValue(couldBeCSSClass, data))) {
            data = data.toLowerCase();
            data = data.replace(findMatchingValue(couldBeCSSClass, data), "");
            //strip string of punctuation or spaces
            data = stripStringCSS(data);
            stcSuccess = true;
            editors[currentEditor].replaceRange('.'+data,{line: cursorPos.line, ch: cursorPos.ch});

        } else if ('cssid' === findKeyNameOfValue(couldBeCSSId, findMatchingValue(couldBeCSSId, data))) {
            //remove command from string
            data = data.toLowerCase();
            data = data.replace(findMatchingValue(couldBeCSSId, data), "");
            //strip string of punctuation or spaces
            data = stripStringCSS(data);
            stcSuccess = true;
            editors[currentEditor].replaceRange('#'+data,{line: cursorPos.line, ch: cursorPos.ch});
            

        } else if ('csstag' === findKeyNameOfValue(couldBeCSSTag, findMatchingValue(couldBeCSSTag, data))) {
            let cssName = findKeyNameOfValue(tags, findMatchingValue(tags, data));
            if (cssName !== undefined) {
                stcSuccess = true;
                editors[currentEditor].replaceRange(cssName,{line: cursorPos.line, ch: cursorPos.ch});
            }
        }
        
        if ('pseudo' === findKeyNameOfValue(couldBeCSSPseudo, findMatchingValue(couldBeCSSPseudo, data))) {
            let cssPseudo = findKeyNameOfValue(cssPseudos, findMatchingValue(cssPseudos, data));
            if (cssPseudo !== undefined) {
                stcSuccess = true;
                editors[currentEditor].replaceRange(cssPseudo,{line: cursorPos.line, ch: cursorPos.ch});
            }
        }

        if ('cssprop' === findKeyNameOfValue(couldBeCSSProp, findMatchingValue(couldBeCSSProp, data))) {
            console.log('is css property');
            // Search cssproperties for a match of other words
            let prop = findKeyNameOfValue(cssProps, findMatchingValue(cssProps, data));
            console.log(prop);
            if (prop !== undefined) {
                stcSuccess = true;
                property = prop+": ;"
                editors[currentEditor].replaceRange(property,{line: cursorPos.line, ch: cursorPos.ch});
            }
        }

        if ('cssvalue' === findKeyNameOfValue(couldBeCSSValue, findMatchingValue(couldBeCSSValue, data))) {
            let values = cssPropVals.concat(colors);
            let value = findKeyNameOfValue(values, findMatchingValue(values, data));
            
            if (value !== undefined) {
                stcSuccess = true;
                // switch case or list checks to see what kind of value it is
            }
        }

    } else if (editorMode === "html") {
        if (dictateMode === 'markup') {
            // If word in words contains something equivalent to 'tags' then proceed
            if ('tag' === findKeyNameOfValue(couldBeTag, findMatchingValue(couldBeTag, data))) {
                console.log('istag')
                // Search tags for a match of other words
                let tag = findKeyNameOfValue(tags, findMatchingValue(tags, data));
                console.log(tag);
                /* if (tag === undefined) {console.log('undefined'); return}; */
                if (tag !== undefined) {
                    stcSuccess = true;
                    let content;
                    if (singletons.indexOf(tag) !== -1) {
                        content = "<"+tag+">";
                        editors[currentEditor].replaceRange(content,{line: cursorPos.line, ch: cursorPos.ch});
                    } else {
                        insertTagIndent(tag, cursorPos);
                    }
                }
                
            }

            if ('attribute-value' === findKeyNameOfValue(couldBeAttrVal, findMatchingValue(couldBeAttrVal, data))) {
                console.log('is attribute value');
                let attrVal = findKeyNameOfValue(attrVals, findMatchingValue(attrVals, data));
                if (attrVal !== undefined) {
                    stcSuccess = true;
                    
                    editors[currentEditor].replaceRange(attrVal,{line: cursorPos.line, ch: cursorPos.ch});
                }
            } else if ('attribute' === findKeyNameOfValue(couldBeAttr, findMatchingValue(couldBeAttr, data))) {
                console.log('is attribute')
                let attr = findKeyNameOfValue(attributes, findMatchingValue(attributes, data));
                console.log(attr);
                /* if (tag === undefined) {console.log('undefined'); return}; */
                if (attr !== undefined) {
                    stcSuccess = true;
                    let content;
                    // if content not in boolean attributes list do this else just raw 
                    content = booleanAttribute.indexOf(attr) !== -1 ? attr : ' '+attr+'=" " ';
                    
                    editors[currentEditor].replaceRange(content,{line: cursorPos.line, ch: cursorPos.ch});
                
                }
            }

            
        }

    }
    if (dictateMode === 'plaintext') {
        if (data.length > 0) {
            stcSuccess = true;
            editors[currentEditor].replaceRange(data,{line: cursorPos.line, ch: cursorPos.ch});
        } 
    }

    if (dictateMode === 'command') {
        
        let command = findKeyNameOfValue(commands, findMatchingValue(commands, data));
        console.log(command)
        if (command !== undefined) stcSuccess = true;
        switch(command) {
            case 'space':
                cursorPos = editors[currentEditor].getCursor();
                editors[currentEditor].replaceRange(" ",{line: cursorPos.line, ch: cursorPos.ch});
                break;
            case 'save':
                saveChanges(currentPage);
                break;
            case 'exit':
                let window = remote.getCurrentWindow();
                if (unsavedChanges) {
                    let confirmation = confirm('Warning! You have unsaved changes.');
                    if (confirmation) {
                        window.close();
                    }
                } else window.close();
                break;
            case 'tab':
                CodeMirror.commands.defaultTab(editors[currentEditor]);
                break;
            case 'enter':
                CodeMirror.commands.newlineAndIndent(editors[currentEditor]);
                break;
            case 'undo':
                editors[currentEditor].doc.undo();
                break;
            case 'redo':
                editors[currentEditor].doc.redo();
                break;
            case 'cut':
                document.execCommand('cut');
                break;
            case 'copy':
                document.execCommand('copy');
                break;
            case 'paste':
                document.execCommand('paste');
                break;
            case 'delete':
                document.execCommand('delete');
                break;
            case 'preview':
                pagePreview();
                break;
            case 'period':
                cursorPos = editors[currentEditor].getCursor();
                editors[currentEditor].replaceRange(".",{line: cursorPos.line, ch: cursorPos.ch});
                break;
            case 'hash':
                cursorPos = editors[currentEditor].getCursor();
                editors[currentEditor].replaceRange("#",{line: cursorPos.line, ch: cursorPos.ch});
                break;
            case 'color-picker':
                toggleDisplay('colorpicker__container');
                break;
            case 'value-tool':
                toggleDisplay('valuetool__container');
                break;
            case 'source':
                let dialogOptionsFiles = {
                    defaultPath: path.join(savesPath,curProjectDetails.name),
                    properties: ['openFile'],
                    filters: [
                        { name: 'All Files', extensions: ['*'] }
                    ]
                }
                let page = document.getElementsByTagName('html')[0];
                page.classList.add("disabled");
                dialog.showOpenDialog(dialogOptionsFiles, filePath => {
                    if (filePath === undefined) {
                        page.classList.remove("disabled");
                    } else {
                        filePath = filePath[0];
                        //logic to determine locale of file and make path relative to project
                        fileInSavePath = filePath.search('\\b'+'saves'+'\\b') !== -1 ? true: false;
                        fileInNamePath = filePath.search('\\b'+curProjectDetails.name+'\\b')!== -1 ? true: false;

                        if (fileInSavePath && fileInNamePath) {
                            console.log('local file')
                            if (editorMode === 'html') {
                                //set path to relative path
                                let splitPath = filePath.split('\\saves\\'+curProjectDetails.name+'\\');
                                relPath = splitPath[1];
                                filePath = relPath;
                            } else if (editorMode === 'css') {
                                //make css relative path here
                                let splitPath = filePath.split('\\saves\\'+curProjectDetails.name+'\\');
                                relPath = '../'+splitPath[1];
                                filePath = relPath;
                            }
                        }
                        document.activeElement.value = filePath;
                    }
                    page.classList.remove("disabled");
                })
                break;
            default:
                break;
            
        }
                
    }
    //confirmation of finished
        toggleClass(frame, 'working');
        console.log(stcSuccess)
        if (stcSuccess && stcSuccess !== undefined) {
            console.log('success', data.length)
            toggleClass(frame, 'finished');
            setTimeout(()=>{
                toggleClass(frame, 'finished');
            },1000);  
        } else {
            console.log('failure', data.length)
            toggleClass(frame, 'error');
            setTimeout(()=>{
                toggleClass(frame, 'error');
                toggleClass(gutter, 'error');
            },1000);    
        }
          
}
    
