function highlighter(step) {
    const iframe = document.querySelectorAll('iframe')[0];
    const iframeDoc = iframe.contentWindow.document;
    
    if (curProjectDetails.layout === 'layout1') {

        switch(step) {
            case 'step-header':
                let header = iframeDoc.getElementsByTagName('header')[0];
                header.style = 'box-shadow: inset 0 0 10px #55fc85;'
                header.scrollIntoView();
                removeShadow(header);
                break;
            case 'step-navigation':
                let nav = iframeDoc.getElementsByTagName('nav')[0];
                nav.style = 'box-shadow: inset 0 0 10px #55fc85;'
                nav.scrollIntoView();
                removeShadow(nav);
                break;
            case 'step-main':
                let main = iframeDoc.getElementById('main-article');
                main.style = 'box-shadow: inset 0 0 10px #55fc85;'
                main.scrollIntoView();
                removeShadow(main);
                break;
            case 'step-column':
                let cols = iframeDoc.getElementById('columns');
                cols.style = 'box-shadow: inset 0 0 10px #55fc85;'
                cols.scrollIntoView();
                removeShadow(cols);
                break;
            case 'step-secondary':
                let secondary = iframeDoc.getElementById('secondary');
                secondary.style = 'box-shadow: inset 0 0 10px #55fc85;'
                secondary.scrollIntoView();
                removeShadow(secondary);
                break;
            case 'step-footer':
                let footer = iframeDoc.getElementsByTagName('footer')[0];
                footer.style = 'box-shadow: inset 0 0 10px #55fc85;'
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
                header.style = 'box-shadow: inset 0 0 10px #55fc85;'
                header.scrollIntoView();
                removeShadow(header);
                break;
            case 'step-navigation':
                let nav = iframeDoc.getElementsByTagName('nav')[0];
                nav.style = 'box-shadow: inset 0 0 10px #55fc85;'
                nav.scrollIntoView();
                removeShadow(nav);
                break;
            case 'step-main':
                let main = iframeDoc.getElementById('main-article');
                main.style = 'box-shadow: inset 0 0 10px #55fc85;'
                main.scrollIntoView();
                removeShadow(main);
                break;
            case 'step-column':
                let cols = iframeDoc.getElementById('columns');
                cols.style = 'box-shadow: inset 0 0 10px #55fc85;'
                cols.scrollIntoView();
                removeShadow(cols);
                break;
            case 'step-secondary':
                let secondary = iframeDoc.getElementById('secondary');
                secondary.style = 'box-shadow: inset 0 0 10px #55fc85;'
                secondary.scrollIntoView();
                removeShadow(secondary);
                break;
            case 'step-footer':
                let footer = iframeDoc.getElementsByTagName('footer')[0];
                footer.style = 'box-shadow: inset 0 0 10px #55fc85;'
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