// Imports
import * as audio from './audio.js';
import * as visualizer from './visualizer.js';
import * as utils from './utils.js';

// Declare constants
const DEFAULTS = Object.freeze({
	sound1  :  "./assets/audio/New Adventure Theme.mp3",
	sound2  :  "./assets/audio/Peanuts Theme.mp3",
	sound3  :  "./assets/audio/The Picard Song.mp3"

});

const windowParams = {
   waveformCanvasWidth : 1000,
   waveformCanvasHeight : 75,
	mainCanvasWidth : 1000,
	mainCanvasHeight : 400,
	playing : "no"
}

const drawParams = {
	waveform : true,
	showGradient : true,
	showBars     : true,
	showCircles  : true,
	showNoise    : false,
	showInvert   : false,
	playHeadPosition : 0
}

const uploadFiles = "";


const init = () => {
   audio.setupWebAudio(DEFAULTS.sound1);

   let waveformCanvas = document.querySelector("#waveformCanvas");
   waveformCanvas.width = windowParams.waveformCanvasWidth;
   waveformCanvas.height = windowParams.waveformCanvasHeight;
   visualizer.setupWaveformCanvas(waveformCanvas, audio.analyserNode);

	let mainCanvas = document.querySelector("#mainCanvas");
	mainCanvas.width = windowParams.mainCanvasWidth;
	mainCanvas.height = windowParams.mainCanvasHeight;
	visualizer.setupMainCanvas(mainCanvas, audio.analyserNode);

	setupUI();
   loop();
};

const loop = () => {
	requestAnimationFrame(loop);

	if (windowParams.playing == "yes" && drawParams.playHeadPosition >= windowParams.waveformCanvasWidth) {
		drawParams.playHeadPosition == 0;
	} else if (windowParams.playing == "yes") {
		visualizer.drawPlayHead(drawParams.playHeadPosition);
		drawParams.playHeadPosition += visualizer.barWidth / 3.5;
		visualizer.drawMain(drawParams);
	}
};


const setupUI = (waveformCanvas) => {

	// A - hookup fullscreen button
   const fsButton = document.querySelector("#fsButton");

   // add .onclick event to button
   fsButton.onclick = e => {
     console.log("init called");
     utils.goFullscreen(document.querySelector("#mainCanvas"));
   };


   let volumeSlider = document.querySelector("#volumeSlider");

   volumeSlider.oninput = e => {
      //set the gain
      audio.setVolume(e.target.value);

      // update value of label to match value of slider
      volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));

   };

   volumeSlider.dispatchEvent(new Event('input'));



   playButton.onclick = e => {
      console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

      // Check if context is in a suspended state (autoplay policy)
      if (audio.audioCtx.state == "suspended") {
         audio.audioCtx.resume();
      }


      if (e.target.dataset.playing == "no") {

         // If track is paused, play it
         audio.playCurrentSound();
			windowParams.playing = "yes";
         e.target.dataset.playing = "yes"; // Our CSS will set the text to "Pause"

      } else {
         audio.pauseCurrentSound();
			windowParams.playing = "no";
         e.target.dataset.playing = "no"; // Our CSS will set the text to "Play"

      }
  };

  document.querySelector("#upload").onchange = (e) => {
	  if (event.target.files[0]) {
		  if (playButton.dataset.playing = "yes") {
			  playButton.dispatchEvent(new MouseEvent("click"));
		  }


		if (drawParams.waveform) {
			document.querySelector("#playButton").disabled = true;
			document.querySelector("#playButton").dataset.playing = "processing";

			// read array buffer
			let fileReader  = new FileReader;
			fileReader.onload = function(){
				audio.loadArrayBuffer(this.result);
			}
			fileReader.readAsArrayBuffer(event.target.files[0])
		}


		  // load sound file
		  var url = URL.createObjectURL(event.target.files[0]);
		  audio.loadSoundFile(url);
		  drawParams.playHeadPosition = 0;
	  }


     //audio.loadSoundFile(URL.createObjectURL(event.target.files[0]))
  };

  let trackSelect = document.querySelector("#trackSelect");

  // add onchange event to <select>
  trackSelect.onchange = e => {

	  if (playButton.dataset.playing == "yes") {
		  playButton.dispatchEvent(new MouseEvent("click"));
	  }
	  audio.xhrLoadSoundFile(e.target.value);
	  drawParams.playHeadPosition = 0;

  };

  audio.audioElement.onended = function(event) {
	  document.querySelector("#playButton").dataset.playing = "no";
	  drawParams.playHeadPosition = 0;
	  windowParams.playing = "no";
  }

  let gradientCheckbox = document.querySelector("#gradientCB");
  gradientCheckbox.onchange = e => {
	  drawParams.showGradient = !drawParams.showGradient;
  };

  let barsCheckbox = document.querySelector("#barsCB");
  barsCheckbox.onchange = e => {
	  drawParams.showBars = !drawParams.showBars;
  };

  let circlesCheckbox = document.querySelector("#circlesCB");
  circlesCheckbox.onchange = e => {
	  drawParams.showCircles = !drawParams.showCircles;
  };

  let noiseCheckbox = document.querySelector("#noiseCB");
  noiseCheckbox.onchange = e => {
	  drawParams.showNoise = !drawParams.showNoise;
  };

  let invertCheckbox = document.querySelector("#invertCB");
  invertCheckbox.onchange = e => {
	  drawParams.showInvert = !drawParams.showInvert;
  }

  let embossCheckbox = document.querySelector("#embossCB");
  embossCheckbox.onchange = e => {
	  drawParams.showEmboss = !drawParams.showEmboss;
  }



  gradientCheckbox.checked = true;
  barsCheckbox.checked = true;
  circlesCheckbox.checked = true;
  noiseCheckbox.checked = false;


};


// Export functions to be used in other modules
export {
   init
}
