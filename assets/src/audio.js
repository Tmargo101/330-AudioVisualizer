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
            // console.log(freqData);
            // console.log("Working");
            freqencyData.push(freqData);
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


   // let fileReader  = new FileReader;
   // fileReader.onload = function(){
   //   let arrayBuffer = this.result;
   //   audioCtx.decodeAudioData(this.result)
   //   .then(function(buffer) {
   //      let rawData = buffer.getChannelData(0);
   //      const samples = 70; // Number of samples we want to have in our final data set
   //      const blockSize = Math.floor(rawData.length / samples); // Number of samples in each subdivision
   //      for (let i = 0; i < samples; i++) {
   //        data.push(rawData[i * blockSize]);
   //      }
   //   });
   // }
   // fileReader.readAsArrayBuffer(testFile);
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
