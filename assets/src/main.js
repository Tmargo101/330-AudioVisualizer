// Imports
import * as audio from './audio.js';
import * as visualizer from './visualizer.js';
import * as utils from './utils.js';

// Declare constants
const DEFAULTS = Object.freeze({
	sound1  :  "./assets/audio/KnightRider1982.mp3",
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
	showBars     : true,
	showCircles  : false,
	showCircularBars : true,
	showKnightRider : false,
	showKRScanner : false,
	showSepia : false,
	showNoise : false,
	showBright : false,
	playHeadPosition : 0,
	radioButtonColor : "red",
	drawType : "frequency"
}

const uploadFiles = "";

let blockDiv, gridContainer;

const init = () => {
	blockDiv = document.querySelector(".blockDiv");
	gridContainer = document.querySelector(".grid-container");

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

	if (window.innerWidth < 1300) {
		blockDiv.style.display = "block";
		gridContainer.style.display = "none";
		audio.pauseCurrentSound();
		windowParams.playing = "no";
		e.target.dataset.playing = "no";

	} else {
		blockDiv.style.display = "none";
		gridContainer.style.display = "grid";

	}

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

	let barsCheckbox = document.querySelector("#barsCB");
	let circlesCheckbox = document.querySelector("#circlesCB");
	let circularBarsCheckbox = document.querySelector("#circularBarsCB");
	let kittCheckbox = document.querySelector("#kittCB");
	let kittScannerCheckbox = document.querySelector("#kittScannerCB");
	let sepiaFilterCheckbox = document.querySelector("#sepiaFilterCB");
	let noiseFilterCheckbox = document.querySelector("#noiseFilterCB");
	let brightFilterCheckbox = document.querySelector("#brightFilterCB");


	let colorRadioButtons = document.querySelectorAll('input[type=radio][name="radioColor"]');

	colorRadioButtons.forEach(radio => radio.addEventListener('change', () => drawParams.radioButtonColor = radio.value));

	let audioRadioButtons = document.querySelectorAll('input[type=radio][name="radioAudioType"]');

	audioRadioButtons.forEach(radio => radio.addEventListener('change', () => drawParams.drawType = radio.value));


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
		audio.xhrLoadSoundFile(audio.audioElement.src);
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
		let value = Math.round((e.target.value * 100));
		let panText = "";
		if (Math.sign(value) == -1) {
			panText = "Left";
		} else if (Math.sign(value) == 1){
			panText = "Right";
		} else {
			panText = "";
		}
		panLabel.innerHTML = `${Math.abs(value)} % ${panText}`;
	};

	bassSlider.oninput = e => {
		audio.setBass(e.target.value);
		bassLabel.innerHTML = `${Math.round((e.target.value / 2))} %`
	};

	trebleSlider.oninput = e => {
		audio.setTreble(e.target.value);
		trebleLabel.innerHTML = `${Math.round((e.target.value / 2 * 10))} %`
	};

  barsCheckbox.onchange = e => {
	  drawParams.showBars = !drawParams.showBars;
  };

  sepiaFilterCheckbox.onchange = e => {
	drawParams.showSepia = !drawParams.showSepia;
  };

  noiseFilterCheckbox.onchange = e => {
	  drawParams.showNoise = !drawParams.showNoise;
  };

  brightFilterCheckbox.onchange = e => {
	drawParams.showBright = !drawParams.showBright;
  };



  circlesCheckbox.onchange = e => {
	  drawParams.showCircles = !drawParams.showCircles;
	  if (drawParams.showCircularBars || drawParams.showKnightRider) {
		  drawParams.showKnightRider = false;
		  drawParams.showCircularBars = false;
		  kittCheckbox.checked = false;
		  circularBarsCheckbox.checked = false;
	  }

  };

  circularBarsCheckbox.onchange = e => {
	  drawParams.showCircularBars = !drawParams.showCircularBars;
	  if (drawParams.showCircles || drawParams.showKnightRider) {
		  drawParams.showKnightRider = false;
		  drawParams.showCircles = false;
		  kittCheckbox.checked = false;
		  circlesCheckbox.checked = false;
	  }
  }

  kittCheckbox.onchange = e => {
	drawParams.showKnightRider = !drawParams.showKnightRider;
	if (drawParams.showCircularBars || drawParams.showCircles) {
		drawParams.showCircularBars = false;
		drawParams.showCircles = false;
		circularBarsCheckbox.checked = false;
		circlesCheckbox.checked = false;
	}

  };

  kittScannerCheckbox.onchange = e => {
	drawParams.showKRScanner = !drawParams.showKRScanner;
  };


	// Setup the view elements on load
  barsCheckbox.checked = true;
  circlesCheckbox.checked = false;
  circularBarsCheckbox.checked = true;
  kittCheckbox.checked = false;
  kittScannerCheckbox.checked = false;
  sepiaFilterCheckbox.checked = false;
  brightFilterCheckbox.checked = false;
  noiseFilterCheckbox.checked = false;

  volumeSlider.dispatchEvent(new Event('input'));
  panSlider.dispatchEvent(new Event('input'));
  trebleSlider.dispatchEvent(new Event('input'));
  bassSlider.dispatchEvent(new Event('input'));



};


// Export functions to be used in other modules
export {
   init
}
