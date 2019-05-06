// REFACTOR THIS CODE BEFORE COMMITTING
const remote = require('electron').remote;

(function handleWindowOptions() {
    // When loaded, start
    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            addListeners();
        }
    };

    // Add listeners and functions to window option buttons
    function addListeners() {
        let window = remote.getCurrentWindow();
        const minBtn = document.getElementById('min-btn'),
            maxBtn = document.getElementById('max-btn'),
            restoreBtn = document.getElementById('restore-btn'),
            closeBtn = document.getElementById('close-btn');
        
        // Add listener for minimise button on click to minimise the window
        minBtn.addEventListener("click", (event) => {
            window = remote.getCurrentWindow();
            window.minimize();
        });

        // Add listener for maximise button on click to maximise the window - toggle max and restore buttons
        maxBtn.addEventListener("click", (event) => {
            window = remote.getCurrentWindow();
            window.maximize();
            // Toggle max and restore buttons
            toggleMaxRestoreBtns();
        });

        // Add listener for restore button on click (only visible once toggled with maximise button or title-bar double click) to restore the window - toggle max and restore buttons
        restoreBtn.addEventListener("click", (event) => {
            window = remote.getCurrentWindow();
            window.unmaximize(); // Restores window/exits fullscreen
            // Toggle max and restore buttons
            toggleMaxRestoreBtns();
        });

        // Listen for maximisation events and toggle min and max buttons - just in case maximise is triggered by title-bar double click instead of window option buttons
        toggleMaxRestoreBtns();
        window.on('maximize', toggleMaxRestoreBtns);
        window.on('unmaximize', toggleMaxRestoreBtns);
        
        // Add listener for close button to close window on click
        closeBtn.addEventListener("click", (event) => {
            window = remote.getCurrentWindow();
            if (editorMode === null) window.close();
            if (editorMode !== "gui") {
                if (unsavedChanges) {
                    let confirmation = confirm('Warning! You have unsaved changes.');
                    if (confirmation) {
                        window.close();
                    }
                } else window.close();
            } else window.close();
                        
        });

        // Function to handle min and max button visibility toggling
        function toggleMaxRestoreBtns() {
            window = remote.getCurrentWindow();
            if (window.isMaximized()) {
                maxBtn.style.display = "none";
                restoreBtn.style.display = "inline-block";
            } else {
                restoreBtn.style.display = "none";
                maxBtn.style.display = "inline-block";
            }
        }
    }
})();