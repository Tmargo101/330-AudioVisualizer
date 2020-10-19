// Imports
import * as audio from './audio.js';
import * as visualizer from './visualizer.js';
import * as utils from './utils.js';
// Declare constants
const DEFAULTS = Object.freeze({
	sound1  :  "./assets/audio/New Adventure Theme.mp3"
});

const init = () => {
   audio.setupWebAudio(DEFAULTS.sound1);
   let canvasElement = document.querySelector("canvas");
   setupUI(canvasElement);

}

function loop(){
	requestAnimationFrame(loop);
	visualizer.draw(drawParams)
}


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
     const files = event.target.files;
     document.querySelector("audio").src = URL.createObjectURL(files[0]);
  };
}


// Export functions to be used in other modules
export {
   init
}
