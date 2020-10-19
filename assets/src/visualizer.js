import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;

const setupCanvas = (canvasElement) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
};

const draw = (drawParams = {}) => {
   
};

export {
   setupCanvas,
   draw
}
