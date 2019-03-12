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