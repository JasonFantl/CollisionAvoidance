
let dt = 2.0;

let boids = [];

function setup() {
  createCanvas(500, 500);
  colorMode(HSB, 255);
  frameRate(30);
  randomSeed(0);

  // populate the grid with boids
  initializeRightAnglePair();
  // initializeStraightOnPair();
  // initializeCircle(10);
  // initializeRandom(20);
  // initializeObstacle();
}



function draw() {
  translate(width / 2, height / 2);
  background(255);


  for (let i = 0; i < boids.length; i++) {
    if (boids[i].stuck) {
      continue;
    }
    // Policies.noCollision(boids[i]);
    // Policies.avoidClosest(boids[i], boids);
    Policies.velocityObstacle(boids[i], boids);
  }

  for (let i = 0; i < boids.length; i++) {
    boids[i].move();
    boids[i].draw();
  }
}