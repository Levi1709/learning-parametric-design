function preload(){
  // preload assets
}

function setup() {
  createCanvas(400, 400, SVG);
}

function draw() {
  background("rgb(45, 5, 42)");

stroke(1, 1, 1, 0);
fill("rgba(116, 200, 140, 0.8)");
  circle(200, 200, 400) // outer

fill("rgba(227, 43, 43, 0.8)");
  circle(200, 200, 325); // more inner
  
fill("rgba(189, 222, 69, 0.7)");
  circle(200, 75, 150); //circle over the middle
  circle(200, 325, 150); //circle under the middle

  circle(75, 200, 150); //circle left
  circle(325, 200, 150); //circle right

fill("rgba(131, 75, 220, 0.7)");
  circle(100, 100, 115); // left top
  circle(300, 100, 115); // right top
  circle(100, 300, 115); // left bottom
  circle(300, 300, 115); // right bottom

fill("rgba(200, 116, 183, 0.5)");
  circle(200, 200, 225); // even more inner

fill("rgba(212, 68, 68, 0.5)");
  circle(200, 200, 150); // most inner
}