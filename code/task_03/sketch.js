function setup() {
  createCanvas(400, 400);
  stroke(0);
}

function draw() {
  background(255);

  let cols = 10;
  let rows = 10;
  let cellSize = width / cols;

  // map mouse to angle
  let angle = map(mouseX, 0, width, -PI / 4, PI / 4);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * cellSize + cellSize / 2;
      let y = j * cellSize + cellSize / 2;

      push();
      translate(x, y);
      rotate(angle + (j * 0.1)); // slight variation by row
      line(-cellSize / 2, 0, cellSize / 2, 0);
      pop();
    }
  }
}
