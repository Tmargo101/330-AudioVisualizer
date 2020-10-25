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
	mainCanvasWidth : 800,
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

	// Start processing the Default track
   audio.setupWebAudio(DEFAULTS.sound1);

	// Create the waveform canvas & start setting it up
   let waveformCanvas = document.querySelector("#waveformCanvas");
   waveformCanvas.width = windowParams.waveformCanvasWidth;
   waveformCanvas.height = windowParams.waveformCanvasHeight;
   visualizer.setupWaveformCanvas(waveformCanvas, audio.analyserNode);

	// Create the main canvas & start setting it up
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

   let fsButton = document.querySelector("#fsButton");
	let restartButton = document.querySelector("#restartPlaybackButton");
	let volumeSlider = document.querySelector("#volumeSlider");
	let panSlider = document.querySelector("#panSlider");
	let bassSlider = document.querySelector("#bassSlider");
	let trebleSlider = document.querySelector("#trebleSlider");
	let trackSelect = document.querySelector("#trackSelect");
	let uploadElement = document.querySelector("#upload");

	let gradientCheckbox = document.querySelector("#gradientCB");
	let barsCheckbox = document.querySelector("#barsCB");
	let circlesCheckbox = document.querySelector("#circlesCB");
	// let noiseCheckbox = document.querySelector("#noiseCB");
	// let invertCheckbox = document.querySelector("#invertCB");
	// let embossCheckbox = document.querySelector("#embossCB");

	// Actions related to audio file events or the waveformCanvas
	uploadElement.onchange = (e) => {
	   if (event.target.files[0]) {

			if (playButton.dataset.playing = "yes") {
				playButton.dispatchEvent(new MouseEvent("click"));
			}

			if (drawParams.waveform) {

				document.querySelector("#playButton").disabled = true;
				document.querySelector("#playButton").dataset.playing = "processing";

				// Read the arrayBuffer in and draw the waveform
				let fileReader  = new FileReader;
				fileReader.onload = function(){
					audio.loadArrayBuffer(this.result);
				}
					fileReader.readAsArrayBuffer(event.target.files[0])
				}

				// load sound file into the audio element
				let url = URL.createObjectURL(event.target.files[0]);
				audio.loadSoundFile(url);
				drawParams.playHeadPosition = 0;
	   }
	};

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

	playButton.onclick = e => {
		if (audio.audioCtx.state == "suspended") {
			audio.audioCtx.resume();
		}
		if (e.target.dataset.playing == "no") {
			audio.playCurrentSound();
			windowParams.playing = "yes";
			e.target.dataset.playing = "yes"; // Our CSS will set the text to "Pause"
		} else {
			audio.pauseCurrentSound();
			windowParams.playing = "no";
			e.target.dataset.playing = "no"; // Our CSS will set the text to "Play"
		}
  };

  restartPlaybackButton.onclick = e => {
	  audio.pauseCurrentSound();
	  windowParams.playing = "no";
	  playButton.dataset.playing == "processing";
	  drawParams.playHeadPosition = 0;
	  visualizer.clearMainCanvas();
	  audio.xhrLoadSoundFile(audio.audioElement.src);
  }



   fsButton.onclick = e => {
     console.log("init called");
     utils.goFullscreen(document.querySelector("#mainCanvas"));
   };

   volumeSlider.oninput = e => {
      audio.setVolume(e.target.value);
      // update value of label to match value of slider
      volumeLabel.innerHTML = `${Math.round((e.target.value / 2 * 100))} %`;

   };

	panSlider.oninput = e => {
		audio.setPan(e.target.value);
		panLabel.innerHTML = `${Math.round((e.target.value / 2 * 100))} %`
	};

	bassSlider.oninput = e => {
		audio.setBass(e.target.value);
		bassLabel.innerHTML = `${Math.round((e.target.value / 2 * 100))} %`
	};

	trebleSlider.oninput = e => {
		audio.setTreble(e.target.value);
		trebleLabel.innerHTML = `${Math.round((e.target.value / 2 * 100))} %`
	};


  gradientCheckbox.onchange = e => {
	  drawParams.showGradient = !drawParams.showGradient;
  };

  barsCheckbox.onchange = e => {
	  drawParams.showBars = !drawParams.showBars;
  };

  circlesCheckbox.onchange = e => {
	  drawParams.showCircles = !drawParams.showCircles;
  };

  // noiseCheckbox.onchange = e => {
	//   drawParams.showNoise = !drawParams.showNoise;
  // };
  //
  // invertCheckbox.onchange = e => {
	//   drawParams.showInvert = !drawParams.showInvert;
  // }
  //
  // embossCheckbox.onchange = e => {
	//   drawParams.showEmboss = !drawParams.showEmboss;
  // }


	// Setup the view elements on load
  gradientCheckbox.checked = true;
  barsCheckbox.checked = true;
  circlesCheckbox.checked = true;
  volumeSlider.dispatchEvent(new Event('input'));
  panSlider.dispatchEvent(new Event('input'));



};


// Export functions to be used in other modules
export {
   init
}
