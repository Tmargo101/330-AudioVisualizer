import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;

let barWidth = 0;
let xPosition = 0;

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

	console.log(`${canvasWidth} / ${data.length} = ${canvasWidth/data.length}`);
	barWidth = canvasWidth/data.length;
	xPosition = 0;

	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvasWidth, canvasHeight);

	for (let x = 0; x < data.length; x++) {

		ctx.fillStyle = 'black';

		// Average out the frequencies
		let total = 0;
		for(let i = 0; i < data[x].length; i++) {
    		total += data[x][i];
		}
		var avg = total / data[x].length;

		// Draw the averaged frequency.
		ctx.fillStyle = "white";
		console.log("Drew at xPosition = " + xPosition + ", barWidth = " + barWidth);
		// ctx.fillRect(xPosition, canvasHeight/2, 1, avg);
		// ctx.fillRect(xPosition, canvasHeight/2, 1, -avg);
		// xPosition += barWidth;


		for (let y = 0; y < data[x].length; y++) {
			ctx.fillStyle = `rgb(${y*15},${y*15},${y*15})`;

			// ctx.fillRect(x, canvasHeight, 1, -data[x][y]);
			ctx.fillRect(xPosition, canvasHeight/2, barWidth, data[x][y]);
			ctx.fillRect(xPosition, canvasHeight/2, barWidth, -data[x][y]);

		}
	}
	console.log(barWidth);


	document.querySelector("#playButton").dataset.playing = "no";
	document.querySelector("#playButton").disabled = false;
};

const drawPlayHead = (inXPosition) => {
	ctx.fillStyle = "rgba(100,100,100,0.2)";
	ctx.fillRect(inXPosition, 0, 1, canvasHeight);
};


export {
   setupCanvas,
   draw,
	drawFrequency,
	drawPlayHead,
	barWidth
}
