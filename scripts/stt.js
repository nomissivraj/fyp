// SPEECH TO TEXT TESTING --------------------------------------------------------------|

const Speech = require('watson-developer-cloud/speech-to-text/v1');
const { spawn } = require('child_process');

// MICROPHONE RECORDING FUNCTIONS
var child;
function startRecording(path) {
console.log("recording");

    child = spawn('sox', ['-t', 'waveaudio', '-d', path]);
        child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}
function stopRecording() {
    setTimeout(() => {
        if (child) child.kill();
    }, 500);
    
}

// SPEECH TO TEXT
var speechToText = new Speech({
    username: '4bab5a29-863d-4d9d-8838-3e2dc3ccdcf1',
    password: 'vnMnoG300QVL',
    url: 'https://stream.watsonplatform.net/speech-to-text/api'
});


var params = {
    objectMode: false,
    content_type: 'audio/wav',
    model: 'en-GB_BroadbandModel',
    continuous: true,
    interim_results: false
};

var transcript;
function toText(path) {
    return new Promise((resolve, reject) => {
        // Create the stream.
        var recognizeStream = speechToText.recognizeUsingWebSocket(params);

        // Pipe in the audio.
        fs.createReadStream(path).pipe(recognizeStream);

        //print to console
        recognizeStream.setEncoding('utf8');


        // Listen for events.
        recognizeStream.on('data', function(event) { onEvent('Data:', event); });
        recognizeStream.on('error', function(event) { onEvent('Error:', event); });
        recognizeStream.on('close', function(event) { onEvent('Close:', event); });
        var text = [];
        // Display events on the console	
        function onEvent(name, event) {
            console.log(name);
            if (name === "Data:") {
                text.push(event.trim());
                
            } else if (name === "Close:") {
                var result = text.join(', ');
                console.log("SPEECH RESULT: ", result);
                resolve(result);
            } else if (name === "Error:") {
                reject(event)
            }
        };
    });
   
}

//END SPEECH TO TEXT TESTING --------------------------------------------------------------|