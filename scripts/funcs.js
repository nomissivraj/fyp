function toggleDisplay(el) {
    el = document.getElementById(el);
    if (!el) return; 
    
    if (el.style.display === 'none') {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
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

    const dictate = document.getElementById('dictate');
    
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
            dictate.innerHTML = "stop dictating"
            startRecording(speechPath);
        } else {
            stopRecording();
            dictate.innerHTML = "dictate";
            toText(speechPath).then((data) => {
                if (target === 'textEditor') {
/*                     console.log('text editor input') */
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
            toggleDisplay('dictate');
        });

        textInputs[i].addEventListener('blur', () => {
            toggleDisplay('dictate');
            stopRecording();
        });

    }
    let textAreas = document.getElementsByTagName('textarea');
    for (let i = 0; i < textAreas.length; i++) {
        textAreas[i].addEventListener('focus', () => {
            toggleDisplay('dictate');
        });

        textAreas[i].addEventListener('blur', () => {
            toggleDisplay('dictate');
            stopRecording();
        });
    }
}


//potentially have 'tags' etcl. as an individual json file and add option to add words to the appropriate key so that the app learns

// possible words that could be intended as 'tag'
let couldBeTag = [
    {'tag':['tag','attack']}
]

let couldBeClass = [
    {'class':['class', 'close']}
]

let couldBeAttr = [
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
     {'p':['p','he','pee','pea','pay']},
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
    {'cut':['cut']},
    {'delete':['delete']},
    {'copy':['copy']},
    {'paste':['paste']},
    {'save':['save']},
    {'exit':['exit','close']}
]

//Might need to set keyword such as 'tag' first and then evaluate all other words together as one string for phrases rather than single inputs?

// List of HTML tags that don't need a closing tag
// Compare the keys in tags list against this list of singletons
let singletons = ['area','base','br','col','','','','','','','',]

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

function speechToCode(data) {
    // Might need to track modes i.e. Text entry | html | css/styles (html or css could be set by active editor) text entry can be triggered by command or alternative click/right click?

    let words = data.toLowerCase().split(" ");
    if (dictateMode === 'markup') {
        for (let word in words) {
            // If word in words contains something equivalent to 'tags' then proceed
            if (words[word] === findKeyNameOfValue(couldBeTag, words[word])) {
                // Search tags for a match of other words
                let tag = findKeyNameOfValue(tags, words[0]);
                if (tag === undefined) return;
                document.activeElement.value = "<"+tag+"></"+tag+">";
            } else if (words[word] === findKeyNameOfValue(couldBeClass, words[word])) { //IF CLASS
                document.activeElement.value = " class='"+words[0]+"'";
            } /* else {
                alert('Sorry I did not understand that, try again');
            }  */
        }
    }
    if (dictateMode === 'plaintext') {
        document.activeElement.value = data;
    }
    if (dictateMode === 'command') {
        
        for (let word in words) {
            if (words[word] === findKeyNameOfValue(commands, words[word])) {
                // Search tags for a match of other words
                let command = findKeyNameOfValue(commands,words[0]);
                switch(command) {
                    case 'space':
                        console.log(command)
                        let cursorPos = editor.getCursor();
                        editor.replaceRange(" ",{line: cursorPos.line, ch: cursorPos.ch});
                        console.log(cursorPos.line,cursorPos.ch)
                        //editor.setCursor(1,2);
                        
                        break;
                    case 'save':
                        saveChanges(currentProject);
                        break;
                    case 'exit':
                        break;
                    default: return;
                }
                
            } 
        }
        
    }
}
    
