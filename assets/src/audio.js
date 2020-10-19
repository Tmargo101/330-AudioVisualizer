let audioCtx;
let element;

let source = null;

// 3 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
   gain : 0.5,
   numSamples : 256
});

const setupWebAudio = (filePath) => {

   // 1 - The || is because WebAudio has not been standardized across browsers yet
   const AudioContext = window.AudioContext || window.webkitAudioContext;
   audioCtx = new AudioContext();

   // 2 - this creates an <audio> element
   element = new Audio();

   // 3 - have it point at a sound file
   loadSoundFile(filePath);

   source = audioCtx.createBufferSource();

   // Create the XHR which will grab the audio contents
   var request = new XMLHttpRequest();
   // Set the audio file src here
   request.open('GET', filePath, true);
   // Setting the responseType to arraybuffer sets up the audio decoding
   request.responseType = 'arraybuffer';
   request.onload = function() {
     // Decode the audio once the require is complete
     audioCtx.decodeAudioData(request.response, function(newBuffer) {
       source.buffer = newBuffer;
       // Connect the audio to source (multiple audio buffers can be connected!)
       //currentBuffer.connect(audioCtx.destination);
       // Simple setting for the buffer
       //currentBuffer.loop = true;
       // Play the sound!
       //currentBuffer.start(0);
     }, function(e) {
       console.log('Audio error! ', e);
     });
   }

   // Send the request which kicks off
   request.send();

console.table(currentBuffer);



};

const loadSoundFile = (filePath) => {
   element.src = filePath;
};

const playCurrentSound = () => {
   element.play();
};

const pauseCurrentSound = () => {
   element.pause();
};

const setVolume = (value) => {
   value = Number(value); // make sure that it's a Number rather than a String
   gainNode.gain.value = value;
};

export {
   // Methods
   setupWebAudio,
   playCurrentSound,
   pauseCurrentSound,
   setVolume,
   loadSoundFile,

   // Elements
   audioCtx,
   analyserNode
};
