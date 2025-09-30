function setup() {
  createCanvas(400, 400);
  noFill();
  stroke(0);
}

function draw() {
  background(255);

  let cols = int(map(mouseX, 0, width, 3, 12));  // grid density from mouseX
  let rows = cols; // keep it square
  let cellSize = width / cols;

  let shapeSize = map(mouseY, 0, height, 5, cellSize * 0.9); // scale with mouseY

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * cellSize + cellSize / 2;
      let y = j * cellSize + cellSize / 2;

      if ((i + j) % 2 == 0) {
        rectMode(CENTER);
        rect(x, y, shapeSize, shapeSize);
      } else {
        ellipse(x, y, shapeSize, shapeSize);
      }
    }
  }
}
