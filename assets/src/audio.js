import * as visualizer from './visualizer.js';

let audioCtx;
let element;

let arrayBuffer = null;
let freqencyData = [];

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

   // let fileReader  = new FileReader;
   // fileReader.onload = function(event){
   //    loadArrayBuffer(event.result);
   // }
   // fileReader.readAsArrayBuffer(filePath.files);


};

const loadSoundFile = (filePath) => {
   element.src = filePath;
};

const loadArrayBuffer = (testArrayBuffer) => {

   // Clear the frequencyData Array
   freqencyData = [];
   let audioBuffer = audioCtx.decodeAudioData(testArrayBuffer, function(e) {

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
            console.log(freqData);
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
      offline.startRendering();
   });

};

const playCurrentSound = () => {
   element.play();
};

const pauseCurrentSound = () => {
   element.pause();
};

const setVolume = (value) => {
   value = Number(value); // make sure that it's a Number rather than a String
   //gainNode.gain.value = value;
};

export {
   // Methods
   setupWebAudio,
   playCurrentSound,
   pauseCurrentSound,
   setVolume,
   loadSoundFile,
   loadArrayBuffer,

   // Elements
   audioCtx,
   freqencyData
   //analyserNode
};
