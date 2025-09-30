function preload(){
  // preload assets
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background("navy");
  // rectangles (white)
  fill(225);
  rect(20, 0, 40, 400);
  rect(100, 0, 40, 400);
  rect(180, 0, 40, 400);
  rect(260, 0, 40, 400);
  rect(340, 0, 40, 400);
  
  
  // squares with uneven spacing, 
  // stroke same color as background so only visible on white rect
  noFill();
  stroke("navy");
  rect(0, 40, 400, 20);
  rect(0, 120, 400, 20);
  rect(0, 200, 400, 20);
  rect(0, 280, 400, 20);
  rect(0, 360, 400, 20);

}