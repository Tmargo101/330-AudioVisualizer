import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;

const setupCanvas = (canvasElement, data) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;

	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvasWidth, canvasHeight);
};

const draw = (drawParams = {}) => {
};

const drawFrequency = (data) => {
	console.log(data.length);
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvasWidth, canvasHeight);
	for (let x = 0; x < data.length; x++) {
		ctx.fillStyle = 'black';
		for (let y = 2; y < data[x].length; y++) {
			ctx.fillStyle = `rgb(${y*15},${y*15},${y*15})`;
			//ctx.fillRect(x, canvasHeight, 1, -data[x][y]);
			ctx.fillRect(x, canvasHeight/2, 1,data[x][y])
			ctx.fillRect(x, canvasHeight/2, 1,-data[x][y])

		}
	}
	document.querySelector("#playButton").dataset.playing = "no";
	document.querySelector("#playButton").disabled = false;
};

const drawPlayHead = (xPosition) => {
	ctx.fillStyle = "rgba(100,100,100,0.2)";
	ctx.fillRect(xPosition, 0, 1, canvasHeight);
};



export {
   setupCanvas,
   draw,
	drawFrequency,
	drawPlayHead
}
