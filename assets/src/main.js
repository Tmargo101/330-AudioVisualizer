// Imports
import * as audio from './audio.js';
import * as visualizer from './visualizer.js';
import * as utils from './utils.js';

// Declare constants
const DEFAULTS = Object.freeze({
	sound1  :  "./assets/audio/New Adventure Theme.mp3"
});

const windowParams = {
   canvasWidth : 800,
   canvasHeight : 400
}

const drawParams = {

}

const uploadFiles = "";




const init = () => {
   audio.setupWebAudio(DEFAULTS.sound1);
   let canvas = document.querySelector("canvas");
   // canvas.width = windowParams.canvasWidth;
   // canvas.height = windowParams.canvasHeight;
   canvas.width = windowParams.canvasWidth;
   canvas.height = windowParams.canvasHeight;
   setupUI(canvas);
   visualizer.setupCanvas(canvas, audio.analyserNode);
   loop();
};

const loop = () => {
	requestAnimationFrame(loop);
	visualizer.draw(drawParams)
};


const setupUI = (canvasElement) => {

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
         e.target.dataset.playing = "yes"; // Our CSS will set the text to "Pause"

      } else {
         audio.pauseCurrentSound();
         e.target.dataset.playing = "no"; // Our CSS will set the text to "Play"

      }
  };

  document.querySelector("#upload").onchange = (e) => {
     if (playButton.dataset.playing = "yes") {
        playButton.dispatchEvent(new MouseEvent("click"));
     }
     audio.loadSoundFile(URL.createObjectURL(event.target.files[0]))
  };
};


// Export functions to be used in other modules
export {
   init
}
