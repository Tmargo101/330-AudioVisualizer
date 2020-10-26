import * as utils from './utils.js';

let waveformCtx,waveformCanvasWidth,waveformCanvasHeight;
let mainCtx, mainCanvasWidth, mainCanvasHeight;
let gradient,analyserNode,rtAudioFreqencyData, rtAudioWaveformData, rtAudioData;

let barWidth = 0;
let xPosition = 0;
let scannerPosition = 0, scannerDirection = "left", scannerCount = 0;

const setupWaveformCanvas = (waveformCanvasElement, data) => {
	// create drawing context
	waveformCtx = waveformCanvasElement.getContext("2d");
	waveformCanvasWidth = waveformCanvasElement.width;
	waveformCanvasHeight = waveformCanvasElement.height;

	waveformCtx.fillStyle = "black";
	waveformCtx.fillRect(0,0,waveformCanvasWidth, waveformCanvasHeight);
};

const setupMainCanvas = (mainCanvasElement, analyserNodeRef) => {
	mainCtx = mainCanvasElement.getContext("2d");
	mainCanvasWidth = mainCanvasElement.width;
	mainCanvasHeight = mainCanvasElement.height;

	mainCtx.fillStyle = "black";
	mainCtx.fillRect(0,0,mainCanvasWidth, mainCanvasHeight);

	analyserNode = analyserNodeRef;
	console.log(analyserNode);
	// this is the array where the analyser data will be stored
	rtAudioFreqencyData = new Uint8Array(analyserNode.fftSize/2);
	rtAudioWaveformData = new Uint8Array(analyserNode.fftSize/2);
	rtAudioData = new Uint8Array(analyserNode.fftSize/2);


};

const drawMain = (params = {}) => {
	// 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference"
   analyserNode.getByteFrequencyData(rtAudioFreqencyData);
	// OR
	analyserNode.getByteTimeDomainData(rtAudioWaveformData); // waveform data

	if (params.drawType == "frequency") {
		for (let i = 0; i < rtAudioFreqencyData.length; i++){
			rtAudioData[i] = rtAudioFreqencyData[i];
		}
	} else {
		for (let i = 0; i < rtAudioWaveformData.length; i++){
			rtAudioData[i] = rtAudioWaveformData[i];
		}
	}
	// 2 - draw background
  mainCtx.save();
  mainCtx.fillStyle = "black";
  mainCtx.globalAlpha = 0.1;
  mainCtx.fillRect(0,0,mainCanvasWidth, mainCanvasHeight);
  mainCtx.restore();

	// 3 - draw gradient
   if (params.showGradient){
     mainCtx.save();
     mainCtx.fillStyle = gradient;
     mainCtx.globalAlpha = 0.3;
     mainCtx.fillRect(0,0,mainCanvasWidth, mainCanvasHeight);
     mainCtx.restore();
   }

   // 4 - draw bars
   if (params.showBars) {
      let barSpacing = 0;
      let margin = 5;
      let screenWidthForBars = mainCanvasWidth - (rtAudioData.length * barSpacing) - margin * 2;
      let barWidth = screenWidthForBars / rtAudioData.length;
      let barHeight = 5;
      let topSpacing = 100;

     mainCtx.save();

	  let gradient = mainCtx.createLinearGradient(0,0,mainCanvasWidth,0);

	  gradient.addColorStop(0,"black");
	  gradient.addColorStop(0.1,params.radioButtonColor);
	  gradient.addColorStop(0.9,params.radioButtonColor);

	  gradient.addColorStop(1, "black");

	  mainCtx.fillStyle = gradient;
     // mainCtx.fillStyle = 'rgba(255,255,255,0.5)';
     mainCtx.strokeStyle = 'rgba(0,0,0,0.5)';
      for (let i = 0; i < rtAudioData.length; i++) {
        mainCtx.fillRect(
            margin + i * (barWidth + barSpacing),
            350 - rtAudioData[i] / 2,
            barWidth,
            barHeight
         );
        mainCtx.strokeRect(
            margin + i * (barWidth + barSpacing),
            topSpacing + 256 - rtAudioData[i] / 2,
            barWidth,
            barHeight
         );

      }
     mainCtx.restore();
   }

	if (params.showCircularBars) {
		let barSpacing = 1;
		let barWidth = 2;
		let circleRotation = 15 / rtAudioData.length;

		mainCtx.save();
		mainCtx.translate(mainCanvasWidth / 2, mainCanvasHeight / 2);

		// let gradient = mainCtx.createRadialGradient(mainCanvasWidth/2, mainCanvasHeight/2, 0, mainCanvasWidth/2, mainCanvasHeight/2, 200);
		let gradient = mainCtx.createLinearGradient(0,0,100,100);

		gradient.addColorStop(0,"red");
		gradient.addColorStop(0.5,params.radioButtonColor)
		gradient.addColorStop(1, "green");

		mainCtx.strokeStyle = gradient;

		for (let i = 0; i < rtAudioData.length; i++) {
			mainCtx.fillStyle = gradient;
			// mainCtx.fillRect(10, 0, rtAudioData[i] / 2.25, barWidth);
			// mainCtx.fillStyle = "green";
			mainCtx.fillRect(125, 0, -(rtAudioData[i] / 3), barWidth);
			mainCtx.fillRect(125, 0, (rtAudioData[i] / 4), barWidth);
			mainCtx.rotate(circleRotation);
		}

		mainCtx.restore();
	}

	if (params.showKnightRider) {
		let barSpacing = 1;
		let barWidth = 65;

		mainCtx.save();
		mainCtx.translate(mainCanvasWidth / 2, mainCanvasHeight / 2.5);
		mainCtx.strokeStyle = params.radioButtonColor;
		mainCtx.fillStyle = params.radioButtonColor;

		// Average frequencies
		let total = 0;
		for(let i = 0; i < rtAudioData.length; i++) {
		    total += rtAudioData[i];
		}
		let avg = total / rtAudioData.length ;


		// for (let i = 0; i < rtAudioData.length; i++) {

			let centerBars = avg / 8;
			let sideBars = avg / 16;

			for (let y = 0; y < centerBars; y++) {
				mainCtx.fillRect(-(barWidth / 2) + y ,y * 8, barWidth - (y * 2) , 4);
				mainCtx.fillRect(-(barWidth / 2) + y ,-(y * 8), barWidth - (y * 2), 4);
			}

			for (let y = 0; y < sideBars; y++) {
				mainCtx.fillRect((-(barWidth / 2) + y) + 75 , y * 8, barWidth - (y * 2) , 4);
				mainCtx.fillRect((-(barWidth / 2) + y) + 75 , -(y * 8), barWidth - (y * 2), 4);

				mainCtx.fillRect((-(barWidth / 2) + y) - 75 , y * 8, barWidth - (y * 2) , 4);
				mainCtx.fillRect((-(barWidth / 2) + y) - 75 , -(y * 8), barWidth - (y * 2), 4);

				// mainCtx.fillRect(-(barWidth / 2) + y) ,y * 8, barWidth - (y * 2) , 4);
				// mainCtx.fillRect(-(barWidth / 2) + y) ,-(y * 8), barWidth - (y * 2), 4);
			}


		mainCtx.restore();

	}

	if (params.showKRScanner) {
		mainCtx.save();
		mainCtx.strokeStyle = params.radioButtonColor;
		mainCtx.fillStyle = params.radioButtonColor;

		mainCtx.translate(mainCanvasWidth / 4, mainCanvasHeight / 3.0);

		mainCtx.fillRect(scannerPosition, 240, 80, 30);

		if (scannerPosition > 300) {
			scannerDirection = "left";
		} else if (scannerPosition < 0) {
			scannerDirection = "right";
		}
		if (scannerCount == 5) {
			if (scannerDirection == "left") {
				scannerPosition -= 50;
			} else {
				scannerPosition += 50;
			}
			scannerCount = 0;

		}

		scannerCount += 1;
		mainCtx.restore();
	}


	// 5 - draw circles
   if (params.showCircles) {
      let maxRadius = mainCanvasHeight / 4;

     mainCtx.save();
     mainCtx.globalAlpha = 0.5;
      for (let i = 0; i < rtAudioData.length; i++) {
         // redish circles
         let percent = rtAudioData[i] / 255;

         let circleRadius = percent * maxRadius;
        mainCtx.beginPath();
        mainCtx.fillStyle = utils.makeColor(255,111,111, 0.34 - percent / 3.0);
        mainCtx.arc(mainCanvasWidth/2, mainCanvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
        mainCtx.fill();
        mainCtx.closePath();

         //blueish circles, bigger, more transparent
        mainCtx.beginPath();
        mainCtx.fillStyle = utils.makeColor(0,0,255, 0.10 - percent / 10.0);
        mainCtx.arc(mainCanvasWidth/2, mainCanvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
        mainCtx.fill();
        mainCtx.closePath();

         //yellow-ish circles, smaller
        mainCtx.save();
        mainCtx.beginPath();
        mainCtx.fillStyle = utils.makeColor(200,200,0, 0.5 - percent / 5.0);
        mainCtx.arc(mainCanvasWidth/2, mainCanvasHeight/2, circleRadius * 0.50, 0, 2 * Math.PI, false);
        mainCtx.fill();
        mainCtx.closePath();
        mainCtx.restore();

      }
     mainCtx.restore();
   }

	// 6 - bitmap manipulation

	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!),
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array
	if (params.showNoise || params.showInvert || params.showEmboss) {
		let imageData =mainCtx.getImageData(0, 0, mainCanvasWidth, mainCanvasHeight);
		let data = imageData.data;
		let length = data.length;
		let width = data.width;

		// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
		for (let i = 0; i < length; i += 4) {
			// C) randomly change every 20th pixel to red
			if (params.showNoise && Math.random() < 0.05) {

				// data[i] is the red channel
				// data[i+1] is the green channel
				// data[i+2] is the blue channel
				// data[i+3] is the alpha channel
				data[i] = data[i + 1] = data[i + 2] = 0; // zero out the red and green and blue channels
				data[i + 2] = 255; // Make the blue channel 100%
				data[i + 1] = 128; 	// Make the green channel 50%
			} // end if

			if (params.showInvert) {
				let red = data[i], green = data[i+1], blue = data[i+2];
				data[i] = 222 - red;
				data[i+1] = 255 - green;
				data[i+2] =255 - blue;
				data[i+3]
			}


		} // end for

		if (params.showEmboss) {
			for (let i = 0; i < length; i++) {
				if (i%4 == 3) {
					continue;
				}
				// Something is really not working here.  Not sure what to do.
				//data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
				//data[i] = 127 + 2*data[i] - data[i + 4] - data[i + width *4];
			}
		}
		// D) copy image data back to canvas
		ctx.putImageData(imageData, 0, 0);
	}





};

const drawFrequency = (data) => {
	waveformCtx.save();
	// console.log(`${waveformCanvasWidth} / ${data.length} = ${waveformCanvasWidth/data.length}`);
	barWidth = waveformCanvasWidth/data.length;
	xPosition = 0;

	waveformCtx.fillStyle = 'black';
	waveformCtx.fillRect(0,0,waveformCanvasWidth, waveformCanvasHeight);

	for (let x = 0; x < data.length; x++) {

		waveformCtx.fillStyle = 'black';

		// Average out the frequencies
		// let total = 0;
		// for(let i = 0; i < data[x].length; i++) {
    	// 	total += data[x][i];
		// }
		// let avg = (total / data[x].length);
		//
		// // Draw the averaged frequency.
		// waveformCtx.fillStyle = "white";
		// console.log("Drew at xPosition = " + xPosition + ", barWidth = " + barWidth);
		// waveformCtx.fillRect(xPosition, waveformCanvasHeight/2, 1, avg);
		// waveformCtx.fillRect(xPosition, waveformCanvasHeight/2, 1, -avg);
		// xPosition += barWidth;


		for (let y = 0; y < data[x].length; y++) {
			waveformCtx.fillStyle = `rgb(${y*15},${y*15},${y*15})`;
			waveformCtx.fillRect(xPosition, waveformCanvasHeight/2, barWidth, data[x][y] / waveformCanvasHeight * 10);
			waveformCtx.fillRect(xPosition, waveformCanvasHeight/2, barWidth, -data[x][y] / waveformCanvasHeight * 10);
		}
		xPosition += barWidth;
	}
	waveformCtx.restore();

	document.querySelector("#playButton").dataset.playing = "no";
	document.querySelector("#playButton").disabled = false;
};

const drawPlayHead = (inXPosition) => {
	waveformCtx.save();
	waveformCtx.fillStyle = "rgba(100,100,100,0.5)";
	waveformCtx.fillRect(inXPosition, 0, barWidth, waveformCanvasHeight);
	waveformCtx.restore();
};

const clearMainCanvas = () => {
	mainCtx.save()
	mainCtx.fillStyle = "black";
	mainCtx.fillRect(0,0,mainCanvasWidth, mainCanvasHeight);
	mainCtx.restore()
}


export {
   setupWaveformCanvas,
	setupMainCanvas,
   drawMain,
	drawFrequency,
	drawPlayHead,
	barWidth,
	clearMainCanvas
}
