import * as visualizer from './visualizer.js';

let audioCtx;
let audioElement, sourceNode, analyserNode, gainNode;

let arrayBuffer = null;
let freqencyData = [];

const DEFAULTS = Object.freeze({
   gain : 0.5,
   numSamples : 256
});

const setupWebAudio = (filePath) => {

   const AudioContext = window.AudioContext || window.webkitAudioContext;
   audioCtx = new AudioContext();

   audioElement = new Audio();

   xhrLoadSoundFile(filePath);

   sourceNode = audioCtx.createMediaElementSource(audioElement);
   analyserNode = audioCtx.createAnalyser();

   analyserNode.fftSize = DEFAULTS.numSamples;

   gainNode = audioCtx.createGain();
   gainNode.gain.value = DEFAULTS.gain;

   sourceNode.connect(analyserNode);
   analyserNode.connect(gainNode);
   gainNode.connect(audioCtx.destination);


};

const loadSoundFile = (filePath) => {
   audioElement.src = filePath;
};

const xhrLoadSoundFile = (filePath) => {

   audioElement.src = filePath;

   // Load the file using an XHR request in arrayBuffer format so it comes in as a blob
   let xhr = new XMLHttpRequest();
   xhr.open('GET', filePath, true);
   xhr.responseType = 'arraybuffer';

   xhr.onload = function(event) {
      console.log(typeof this.response);

      if (this.status == 200) {
         loadArrayBuffer(this.response);
      }
   }

   // Trigger the xhr.onload event
   xhr.send();
};

const loadArrayBuffer = (testArrayBuffer) => {
   // Disable the play button while processing is happening
   document.querySelector("#playButton").disabled = true;
   document.querySelector("#playButton").dataset.playing = "processing";

   // Clear the frequencyData Array
   freqencyData = [];
   let audioBuffer = audioCtx.decodeAudioData(testArrayBuffer, function(e) {

      // Start of code
      var offline = new OfflineAudioContext(2, e.length ,44100);
      var bufferSource = offline.createBufferSource();
      bufferSource.buffer = e;

      var analyser = offline.createAnalyser();
      analyser.fftSize= 32;
      var scp = offline.createScriptProcessor(256, 0, 1);

      bufferSource.connect(analyser);
      scp.connect(offline.destination); // this is necessary for the script processor to start

      let count =  0;
      scp.onaudioprocess = function(){
         if (count == 10) {
            let freqData = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(freqData);
            // console.log(freqData);
            // freqencyData.push(freqData);
            let sum = freqData.reduce(function(a, b) {return a + b;}, 0);
            if (sum != 0) {
               freqencyData.push(freqData);
            }
            count = 0;
         }
         count += 1;
      };
      bufferSource.start(0);
      offline.oncomplete = function(e){
        console.log('analysed');
        visualizer.drawFrequency(freqencyData);
      };

      // Trigger the render event
      offline.startRendering();
   });

};

const playCurrentSound = () => {
   audioElement.play();
};

const pauseCurrentSound = () => {
   audioElement.pause();
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
   loadArrayBuffer,
   xhrLoadSoundFile,

   // audioElements
   audioCtx,
   freqencyData,
   audioElement,
   analyserNode
};
