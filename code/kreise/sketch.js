function preload(){
  // preload assets
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background("rgb(203, 248, 188)");

  // Define the coordinates and radius of the big circle
  let bigCircleX = width / 2;
  let bigCircleY = height / 2
  let bigCircleRadius = 150;

  // Draw the big circle
  noFill();
  noStroke();
  strokeWeight(2);
  ellipse(bigCircleX, bigCircleY, bigCircleRadius * 2);

  // Define the number and radius of the smaller circles
  let numSmallCircles = 15; // Change this value to input the number of smaller circles
  let smallCircleRadius = 25;

  // Calculate the coordinates of the smaller circles
  for (let i = 0; i < numSmallCircles; i++) {
    let angle = TWO_PI * i / numSmallCircles;
    let smallCircleX = bigCircleX + bigCircleRadius * cos(angle);
    let smallCircleY = bigCircleY + bigCircleRadius * sin(angle);

    // Draw the smaller circle
    noFill();
    stroke(0);
    strokeWeight(2);
    ellipse(smallCircleX, smallCircleY, smallCircleRadius * 2);
  }
}