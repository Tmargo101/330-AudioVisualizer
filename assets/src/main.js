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
};

const loop = () => {
	requestAnimationFrame(loop);
	visualizer.draw(drawParams)
};


const setupUI = (canvasElement) => {

   playButton.onclick = e => {
      console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

      // Check if context is in a suspended state (autoplay policy)
      if (audio.audioCtx.state == "suspended") {
         audio.audioCtx.resume();
      }

      console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

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
     // uploadFiles = URL.createObjectURL(event.target.files[0]);
     audio.setupWebAudio(URL.createObjectURL(event.target.files[0]));
  };
};


// Export functions to be used in other modules
export {
   init
}
