const padding = 5;
const progressBarHeight = 20;
const useWebGl = true;

let ourMap;
let song, fft, amplitude;

let diameterSlider;
let blurSlider;

let renderDebugMode = false;



function preload() {
  song = loadSound("ztechno.mp3");
}

function keyPressed() {
  if (key == 'd') {
    renderDebugMode = !renderDebugMode;
  }
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight, useWebGl ? WEBGL : P2D);
  pixelDensity(1);
  background(0);

  fft = new p5.FFT();

  amplitude = new p5.Amplitude();

  let playButton = createButton("Play / Pause");
  playButton.mousePressed(togglePlayPause);
  playButton.elt.style = `position: fixed; left: 50%; bottom: ${2 * padding + progressBarHeight}px; transform: translate(-50%, 0);`;

  diameterSlider = createSlider(2, 50, 30);
  diameterSlider.size(300);

  blurSlider = createSlider(0, 5, 1);
  blurSlider.size(300);

  let spanSize = createSpan("size");

  let spanBlur = createSpan("blur");

  let divSize = createDiv();
  divSize.position(10, 10);

  let divBlur = createDiv();
  divBlur.position(10,40);

  spanSize.parent(divSize);
  diameterSlider.parent(divSize);

  spanBlur.parent(divBlur);
  blurSlider.parent(divBlur);


  ourMap = new TerrainMap(windowWidth, windowHeight, canvas);
  loop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let newMap = new TerrainMap(windowWidth, windowHeight, canvas);
  newMap.copyHeightDataFrom(ourMap);
  ourMap = newMap;
}

function draw() {
  let velocity = 0.5 * amplitude.getLevel();
  fft.analyze();
  background(0);
  ourMap.updateFromFft(fft, velocity);
  ourMap.smooth();
  ourMap.updateImageBuffer();
  drawProgressBar();
}

function togglePlayPause() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}

function drawProgressBar() {
  let left = padding;
  let top = windowHeight - padding - progressBarHeight;
  const width = windowWidth - 2 * padding;

  if(useWebGl) {
    left -= windowWidth / 2;
    top -= windowHeight / 2;
  }

  const duration = song.duration();
  if (duration === 0) return;

  const current = song.currentTime();
  const progress = constrain(current / duration, 0, 1);
  const filledWidth = width * progress;

  noStroke();
  fill(100);
  rect(left, top, width, progressBarHeight);

  fill(255, 50, 50);
  rect(left, top, filledWidth, progressBarHeight);
}

class TerrainTypes {
  constructor() {
    let terrains = [
      {relativeHeight: 0.1,  color: color(50, 50, 150),   hint: "deep water"},
      {relativeHeight: 0.2, color: color(62, 62, 194),   hint: "medium water"},
      {relativeHeight: 0.3, color: color(71, 71, 255),   hint: "shallow water"},
      {relativeHeight: 0.4,  color: color(217, 224, 139), hint: "beach"},
      {relativeHeight: 0.5,  color: color(67, 204, 67),   hint: "grass"},
      {relativeHeight: 0.6, color: color(17, 99, 33),    hint: "forest"},
      {relativeHeight: 0.7,  color: color(50, 54, 45),    hint: "dirt"},
      {relativeHeight: 0.8, color: color(48, 41, 41),    hint: "rock"},
      {relativeHeight: 0.85,  color: color(255, 255, 255), hint: "snow"},
    ];

    terrains.sort((terrain1, terrain2) => terrain1.relativeHeight - terrain2.relativeHeight);

    this.lookupTable = new Array(256);
    for(let height = 0; height < this.lookupTable.length; ++height) {
      let terrain = terrains.find(terrain => terrain.relativeHeight * 255 >= height) ?? terrains.at(-1);
      this.lookupTable[height] = [terrain.color._getRed(), terrain.color._getGreen(), terrain.color._getBlue(), terrain.color._getAlpha()]
    }
  }

  getColorForHeight(height) {
    return this.lookupTable[height];
  }
}

class TerrainMap {
  constructor(w, h, canvas) {
    this.heightBuffer = createGraphics(w, h, useWebGl ? WEBGL : P2D); // height at pixel, from 0-255
    this.heightBuffer.noStroke();

    this.terrainTypes = new TerrainTypes();

    this.canvas = canvas;
    this.frequencyRanges = ["bass", "lowMid", "mid", "highMid", "treble"];
  }

  copyHeightDataFrom(other) {
    const rows = min(this.heightBuffer.height, other.heightBuffer.height);
    const valuesPerRow = 4 * min(this.heightBuffer.width, other.heightBuffer.width);

    this.heightBuffer.loadPixels();
    other.heightBuffer.loadPixels();
    
    for(let row = 0; row < rows; ++row) {
      let thisRowOffset = 4 * this.heightBuffer.width * row;
      let otherRowOffset = 4 * other.heightBuffer.width * row;

      for(let valueInRow = 0; valueInRow < valuesPerRow; ++valueInRow) {
        this.heightBuffer.pixels[thisRowOffset + valueInRow] = other.heightBuffer.pixels[otherRowOffset + valueInRow];
      }
    }

    this.heightBuffer.updatePixels();
  }

  updateImageBuffer() {
    if (renderDebugMode) {
      if(useWebGl)
        image(this.heightBuffer, -this.canvas.width/2, -this.canvas.height/2);
      else
        image(this.heightBuffer, 0, 0);
      
    } else {
  
      this.heightBuffer.loadPixels();
      loadPixels();

      for(let pixel = 0; pixel < this.heightBuffer.pixels.length; pixel += 4) {
        const height = this.heightBuffer.pixels[pixel];
        const rgba = this.terrainTypes.getColorForHeight(height);

        pixels[pixel + 0] = rgba[0];
        pixels[pixel + 1] = rgba[1];
        pixels[pixel + 2] = rgba[2];
        pixels[pixel + 3] = rgba[3];
      }

      updatePixels();
    }
   
  }

  updateFromFft(fft, velocity) {
    for (let frequencyRange = 0; frequencyRange < this.frequencyRanges.length; ++frequencyRange) {
      let energy = fft.getEnergy(this.frequencyRanges[frequencyRange]);
      let x = map(
        noise(0.003 * frameCount * (1 + frequencyRange * 2) + 136986773516911 * (1+frequencyRange)),
        0.2, 0.8,
        0, this.canvas.width
      );
      let y = map(
        noise(0.003 * frameCount * (1 + frequencyRange * 2) + 430973482754183 * (1+frequencyRange)),
        0.2, 0.7,
        0, this.canvas.height,
      );

      if(useWebGl) {
        x -= this.heightBuffer.width / 2;
        y -= this.heightBuffer.height / 2;
      }

      this.heightBuffer.fill(energy, 255 * velocity);
      this.heightBuffer.circle(x, y, diameterSlider.value());

      this.heightBuffer.fill(energy, 128 * velocity);
      this.heightBuffer.circle(x, y, diameterSlider.value() * 2);

      this.heightBuffer.fill(energy, 64 * velocity);
      this.heightBuffer.circle(x, y, diameterSlider.value() * 3);
    }
  }

  smooth() {
    this.heightBuffer.filter(BLUR, blurSlider.value());
  }
}