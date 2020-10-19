import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;

const setupCanvas = (canvasElement, data) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
   thisBuffer = data;
};

const draw = (drawParams = {}) => {
   console.table(audio.data);
};

export {
   setupCanvas,
   draw
}
