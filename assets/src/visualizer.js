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

const draw = (drawParams = {}) => {
   // Drawing code goes here
   analyserNode.getByteFrequencyData(audioData);

   ctx.save();
   ctx.fillStyle = "black";
   ctx.globalAlpha = 0.1;
   ctx.fillRect(0,0,canvasWidth, canvasHeight);
   ctx.restore();

   let barSpacing = 4;
   let margin = 5;
   let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
   let barWidth = screenWidthForBars / audioData.length;
   let barHeight = 500;
   let topSpacing = 100;

   ctx.save();
   ctx.fillStyle = 'rgba(255,255,255,0.5)';
   ctx.strokeStyle = 'rgba(0,0,0,0.5)';
   for (let i = 0; i < audioData.length; i++) {
      ctx.fillRect(
         margin + i * (barWidth + barSpacing),
         topSpacing + 256 - audioData[i],
         barWidth,
         barHeight
      );
      ctx.strokeRect(
         margin + i * (barWidth + barSpacing),
         topSpacing + 256 - audioData[i],
         barWidth,
         barHeight
      );

   }
   ctx.restore();

};

export {
   setupCanvas,
   draw
}
