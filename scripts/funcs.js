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
function initDictate(target) {
    const speechPath = path.join(app.getPath('documents'),'Vocal Developer Projects','/speech/test.wav');
    let active = false;

    const dictate = document.getElementById('dictate');
    
    dictate.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (!active) {
            dictate.innerHTML = "stop dictating"
            startRecording(speechPath);
        } else {
            stopRecording();
            dictate.innerHTML = "dictate";
            toText(speechPath).then((data) => {
                if (target === 'textEditor') {
                    console.log('text editor input')
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
    {'tag':['tag']}
]

let couldBeClass = [
    {'class':['class', 'close']}
]
let tags = [
     {'div': ['div', 'dave']},
     {'main': ['main', 'mane', 'mean']}
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

function speechToCode(data) {
    let words = data.toLowerCase().split(" ");
    
    for (word in words) {
        // If word in words contains something equivalent to 'tags' then proceed
        if (words[word] === findKeyNameOfValue(couldBeTag, words[word])) {
            // Search tags for a match of other words
            let tag = findKeyNameOfValue(tags, words[0]);
            document.activeElement.value = "<"+tag+"></"+tag+">";
        } else if (words[word] === findKeyNameOfValue(couldBeClass, words[word])) { //IF CLASS
            document.activeElement.value = " class='"+words[0]+"'";
        } /* else {
            alert('Sorry I did not understand that, try again');
        }  */
    }
}
    
