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
                console.log('left mouse',e.which);
                break;
            case 2:
                dictateMode = 'command';
                console.log('middle mouse',e.which);
                break;
            case 3:
                dictateMode = 'plaintext';
                console.log('right mouse',e.which);
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
    {'tag':['tag','tags','attack', 'had','tack','tagged','tank','tak','tax','contain','container']}
]

let couldBeClass = [
    {'class':['class', 'close']}
]

let couldBeAttr = [
    {'attribute':['attribute', 'attributes','tribute']}
]

let attributes = [
    //haven't tested any of these yet
    {'alt':['alt', 'out', 'alternative','ought']},
    {'src':['src', 'source']},
    {'type':['type']},
    {'width':['width', 'with', 'which']},
    {'height':['height']},
    {'lang':['lang', 'language']},
    {'title':['title']},
    {'required':['required']},
    {'rel':['rel', 'relationship', 'well', 'relationship']},
    {'href':['hyperlink','hyperlinked']}
]

let tags = [
     {'div': ['div', 'dave']},
     {'main': ['main', 'mane', 'mean']},
     {'p':['p','p.','he','pee','pea','pay','paragraph','paragraphs','pete']},
     {'a':['anchor']},
     {'h1':['h1','heading']},
     {'article':['article','articles']},
     {'button':['button', 'buttons','but','martin','barton','bolton']},
     //Singletons
     {'area': ['area']},
     {'base':['base']},
     {'br':['br', 'break']},
     {'col':['col', 'call', 'cole']},
     {'embed':['embed']},
     {'hr':['hr','horizontal']},
     {'img':['img', 'image']},
     {'input':['input', 'put', 'part']},
     {'keygen':['keygen', 'keygens']},
     {'link':['link']},
     {'meta':['meta', 'matt', 'mat']},
     {'param':['parameter', 'haram', 'perimeter']},
     {'source':['source','sauce']}, // this one could cause issues with src attribute... need to test
     {'track':['track']}/* ,
     {'wbr':['wbr']} This one might not be workable */
]

//might need to make commands to make '<' and '>'
let commands = [
    //none of these have been tested yet
    {'space':['space']},
    {'cut':['cut','scott']},
    {'delete':['delete']},
    {'copy':['copy']},
    {'paste':['paste','post']},
    {'save':['save']},
    {'exit':['exit','close','closed','except']},
    {'undo':['undo', 'reverse', 'reversed']},
    {'redo':['redo','radio', 'redial','forward']},
    {'tab':['tab','tampa','tam','tap']},
    {'enter':['enter','line']},
    {'preview':['preview', 'previous']},
    {'period':['period']},
    {'hash': ['hash']}
]

//Might need to set keyword such as 'tag' first and then evaluate all other words together as one string for phrases rather than single inputs?

// List of HTML tags that don't need a closing tag
// Compare the keys in tags list against this list of singletons
let singletons = ['area','base','br','col','embed','hr','img','input','keygen','link','meta','param','source','track'];

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


function speechToCode(data) {
    let stcSuccess = false;
    // Might need to track modes i.e. Text entry | html | css/styles (html or css could be set by active editor) text entry can be triggered by command or alternative click/right click?
    let cursorPos = editors[currentEditor].getCursor();
    let words = data.toLowerCase().split(" ");
    // Get elements for "working..." indication/feedback    

    let frame = '.CodeMirror';
    let gutter = '.gutter';

    if (dictateMode === 'markup') {
        for (let word in words) {
            // If word in words contains something equivalent to 'tags' then proceed
            if ('tag' === findKeyNameOfValue(couldBeTag, words[word])) {
                console.log('istag')
                // Search tags for a match of other words
                let tag = findKeyNameOfValue(tags, words[0]);
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

            // If attribute
            if ('attribute' === findKeyNameOfValue(couldBeAttr, words[word])) {
                console.log('is attribute')
                let tag = findKeyNameOfValue(attributes, words[0]);
                console.log(tag);
                /* if (tag === undefined) {console.log('undefined'); return}; */
                if (tag !== undefined) {
                    stcSuccess = true;
                    let content;
                    if (tag === 'href') {
                        content = ' '+tag+'="http://"';
                    } else content = ' '+tag+'=""' ;
                    editors[currentEditor].replaceRange(content,{line: cursorPos.line, ch: cursorPos.ch});
                
                }
            }

            // If class
            if ('class' === findKeyNameOfValue(couldBeClass, words[word])) { //IF CLASS
                stcSuccess = true;
                let content = " class='"+words[0]+"'";
                editors[currentEditor].replaceRange(content,{line: cursorPos.line, ch: cursorPos.ch});
            } 

            
        }
    }

    if (dictateMode === 'plaintext') {
        if (data.length > 0) {
            stcSuccess = true;
            editors[currentEditor].replaceRange(data,{line: cursorPos.line, ch: cursorPos.ch});
        } 
    }

    if (dictateMode === 'css') {
        //DO CSS functions here
    }

    if (dictateMode === 'command') {
        
        for (let word in words) {
            
                let command = findKeyNameOfValue(commands,words[word]);
                console.log(command)
                if (command !== undefined) stcSuccess = true;
                switch(command) {
                    case 'space':
                        cursorPos = editors[currentEditor].getCursor();
                        editors[currentEditor].replaceRange(" ",{line: cursorPos.line, ch: cursorPos.ch});
                        break;
                    case 'save':
                        saveChanges(currentProject);
                        break;
                    case 'exit':
                        let window = remote.getCurrentWindow();
                        window.close();
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
                    default:
                        break;
                    
                }
                
            /* } */ 
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
    
