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

function initDictate() {
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
                document.activeElement.value = data;
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
        });

    }
}
    
