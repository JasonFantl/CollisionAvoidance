
let dt = 1.0;

let boids = [];

function setup() {
  createCanvas(300, 300);
  colorMode(HSB, 255);
  frameRate(30);
  randomSeed(0);

  // populate the grid with boids
  // initializeRightAnglePair();
  initializeStraightOnPair();
  // initializeCircle(3);
  // initializeRandom(20);
  // initializeObstacle();
}

let freeze_time = false

function draw() {
  translate(width / 2, height / 2);
  background(255);

  freeze_time = keyIsPressed;


  for (let i = 0; i < boids.length; i++) {
    if (boids[i].stuck) {
      continue;
    }
    // Policies.noCollision(boids[i]);
    // Policies.avoidClosest(boids[i], boids);

    Policies.velocityObstacle(boids[i], boids);

    // if (i == 0) {
    //   Policies.velocityObstacle(boids[i], boids);
    // } else {
    //   Policies.noCollision(boids[i]);
    // }
  }

  for (let i = 0; i < boids.length; i++) {
    boids[i].move();
    boids[i].draw();

    for (let j = i + 1; j < boids.length; j++) {
      if (dist(boids[i].position.x, boids[i].position.y, boids[j].position.x, boids[j].position.y) < boids[i].radius + boids[j].radius) {
        boids[i].collided = true;
        boids[j].collided = true;
      }
    }
  }
}

function mousePressed() {
  boids[0].goal = createVector(mouseX - width / 2, mouseY - height / 2);
}
