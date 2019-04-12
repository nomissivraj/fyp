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

function resetForms(el) {    
    let forms = document.querySelectorAll('form');
    for (let i = 0; i < forms.length; i++) {
        forms[i].reset();
    }
    toggleDisplay(el);
}
// Initiate dictate button/function on target i.e. text editor or general UI input
// If in text editor then pass through to a different function that processes the text
let dictateMode = 'default';
function initDictate(target) {
    const speechPath = path.join(app.getPath('documents'),'Voice Developer Projects','/speech/test.wav');
    let active = false;

    const dictate = document.getElementById('dictate-btn');
    let frame = document.getElementsByClassName('CodeMirror')[0];
    let gutter = document.getElementsByClassName('CodeMirror-gutters')[0];

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
        if (!active) {
            toggleClass(dictate, 'active');
            toggleClass(frame, 'shadow-positive');
            toggleClass(gutter, 'transparent');
            startRecording(speechPath);
        } else {
            stopRecording();
            toggleClass(dictate, 'active');
            toggleClass(frame, 'shadow-positive');
            toggleClass(gutter, 'transparent');
            toggleClass(frame, 'working');
            toggleClass(gutter, 'transparent');
            toText(speechPath).then((data) => {
                if (target === 'textEditor') {
                    speechToCode(data);
                } else {
                    document.activeElement.value = data;
                }
            });
        }
        !active ? active = true : active = false;
    });

    let textInputs = document.querySelectorAll('input[type=text]');
    for (let i = 0; i < textInputs.length; i++) {
        textInputs[i].addEventListener('focus', () => {
            toggleDisplay('dictate-btn');
        });

        textInputs[i].addEventListener('blur', () => {
            toggleDisplay('dictate-btn');
            stopRecording();
        });

    }
    let textAreas = document.getElementsByTagName('textarea');
    for (let i = 0; i < textAreas.length; i++) {
        textAreas[i].addEventListener('focus', () => {
            toggleDisplay('dictate-btn');
        });

        textAreas[i].addEventListener('blur', () => {
            toggleDisplay('dictate-btn');
            stopRecording();
        });
    }
}


//potentially have 'tags' etcl. as an individual json file and add option to add words to the appropriate key so that the app learns

// possible words that could be intended as 'tag'
let couldBeTag = [
    {'tag':['tag','tags','attack', 'had','tack','tagged','tank','tak','tax','container']}
]

let couldBeClass = [
    {'class':['class', 'close']}
]

let couldBeAttr = [
    {'attribute':['attribute']}
]

let attributes = [
    //haven't tested any of these yet
    {'alt':['alt']},
    {'src':['src']},
    {'type':['type']},
    {'width':['width']},
    {'height':['height']},
    {'lang':['lang', 'language']},
    {'title':['title']},
    {'required':['required']}
]

let tags = [
     {'div': ['div', 'dave']},
     {'main': ['main', 'mane', 'mean']},
     {'p':['p','p.','he','pee','pea','pay','paragraph','paragraphs','pete']},
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
    {'enter':['enter','line']}
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
    editor.replaceRange("<"+tag+">",{line: cursorPos.line, ch: cursorPos.ch});
    CodeMirror.commands.indentAuto(editor); // Auto indent opening tab
    CodeMirror.commands.newlineAndIndent(editor); // Simulate Enter key
    
    // Get cursor position to return to after insertion
    let cursorPosfinal = editor.getCursor(); 
    CodeMirror.commands.newlineAndIndent(editor); // Simulate Enter key for closing tag position
    let cursorPos2 = editor.getCursor();  // Get new position for closing tag 

    // Insert Closing tag
    editor.replaceRange("</"+tag+">",{line: cursorPos2.line, ch: cursorPos2.ch});     
    CodeMirror.commands.indentAuto(editor); // Auto Indet closing tag
    editor.setCursor(cursorPosfinal.line,cursorPosfinal.ch) // Set cursor back to final position between two tags
}


function speechToCode(data) {
    // Might need to track modes i.e. Text entry | html | css/styles (html or css could be set by active editor) text entry can be triggered by command or alternative click/right click?
    let cursorPos = editor.getCursor();
    let words = data.toLowerCase().split(" ");
    const codeEditor = document.getElementsByClassName('CodeMirror')[0];
    // Get elements for "working..." indication/feedback    

    let frame = document.getElementsByClassName('CodeMirror')[0];
    let gutter = document.getElementsByClassName('CodeMirror-gutters')[0];

    if (dictateMode === 'markup') {
        for (let word in words) {
            // If word in words contains something equivalent to 'tags' then proceed
            if ('tag' === findKeyNameOfValue(couldBeTag, words[word])) {
                console.log('istag')
                // Search tags for a match of other words
                let tag = findKeyNameOfValue(tags, words[0]);
                console.log(tag);
                if (tag === undefined) {console.log('undefined'); return};

                let content;
                if (singletons.indexOf(tag) !== -1) {
                    content = "<"+tag+">";
                    editor.replaceRange(content,{line: cursorPos.line, ch: cursorPos.ch});
                } else {
                    insertTagIndent(tag, cursorPos);
                }
            }

            if ('class' === findKeyNameOfValue(couldBeClass, words[word])) { //IF CLASS
                let content = " class='"+words[0]+"'";
                editor.replaceRange(content,{line: cursorPos.line, ch: cursorPos.ch});
            } /* else {
                console.log(data);
                let responses = [
                    'Sorry I did not understand that, try again',
                    "Sorry I couldn't make that out",
                    "Try speaking clearer"
                ]
                console.log(Math.floor(Math.random() * (responses.length - 1)));
                alert(responses[Math.floor(Math.random() * (responses.length -1))]);
                return;
            }  */
        }
    }

    if (dictateMode === 'plaintext') {
        editor.replaceRange(data,{line: cursorPos.line, ch: cursorPos.ch});
        let newCursorPos = editor.getCursor()
        editor.replaceRange(" ",{line: newCursorPos.line, ch: newCursorPos.ch});
    }

    if (dictateMode === 'css') {
        //DO CSS functions here
    }

    if (dictateMode === 'command') {
        
        for (let word in words) {
            /* console.log(words[word],findKeyNameOfValue(commands, words[word]))
            if (words[word] === findKeyNameOfValue(commands, words[word])) {
                // Search tags for a match of other words */
                let command = findKeyNameOfValue(commands,words[word]);
                console.log(command)
                switch(command) {
                    case 'space':
                        cursorPos = editor.getCursor();
                        editor.replaceRange(" ",{line: cursorPos.line, ch: cursorPos.ch});
                        break;
                    case 'save':
                        saveChanges(currentProject);
                        break;
                    case 'exit':
                        let window = remote.getCurrentWindow();
                        window.close();
                        break;
                    case 'tab':
                        CodeMirror.commands.defaultTab(editor);
                        break;
                    case 'enter':
                        CodeMirror.commands.newlineAndIndent(editor);
                        break;
                    case 'undo':
                        editor.doc.undo();
                        break;
                    case 'redo':
                        editor.doc.redo();
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
                    default: return;
                    
                }
                
            /* } */ 
        }
        
    }
    //confirmation of finished
        toggleClass(frame, 'working');
        toggleClass(frame, 'finished');
        setTimeout(()=>{
            toggleClass(frame, 'finished');
            toggleClass(gutter, 'transparent');
        },1000)        
}
    
