import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;

const setupCanvas = (canvasElement,analyserNodeRef) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom

	// keep a reference to the analyser node
   analyserNode = analyserNodeRef;

	// this is the array where the analyser data will be stored
   audioData = new Uint8Array(analyserNode.fftSize/2);
};

const draw = (drawParams) => {
   // Drawing code goes here
};

export {
   setupCanvas,
   draw
}
