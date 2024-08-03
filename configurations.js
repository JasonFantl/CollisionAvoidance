function initializeCircle(num_boids) {
  for (let i = 0; i < num_boids; i++) {
    let start_vector = p5.Vector.fromAngle(TWO_PI * i / num_boids).mult(width / 2.5);
    let goal_vector = p5.Vector.fromAngle(TWO_PI * i / num_boids).mult(-width / 2.5);

    boids[i] = new Boid(start_vector, goal_vector, color((255 * i / num_boids + 140) % 255, 255, 255));
  }
}

function initializeStraightOnPair(num_boids) {
  initializeCircle(2);
}

function initializeRightAnglePair(num_boids) {
  for (let i = 0; i < 2; i++) {
    let start_vector = p5.Vector.fromAngle(TWO_PI * i / 4).mult(width / 2.1);
    let goal_vector = p5.Vector.fromAngle(TWO_PI * i / 4).mult(-width / 2.1);

    boids[i] = new Boid(start_vector, goal_vector, color(255 * i / 2, 255, 255));
  }
}

function initializeRandom(num_boids) {
  for (let i = 0; i < num_boids; i++) {
    let start_vector = createVector(random(width) - width / 2, random(height) - height / 2);
    let goal_vector = createVector(random(width) - width / 2, random(height) - height / 2);

    boids[i] = new Boid(start_vector, goal_vector, color(255 * i / num_boids, 255, 255));
  }
}

function initializeObstacle() {
  let start_vector = createVector(200, 0);
  let goal_vector = createVector(-200, 0);
  boids[0] = new Boid(start_vector, goal_vector, color(255, 255, 255));
  boids[1] = new Boid(createVector(), createVector(), color(100, 255, 255));
  boids[1].stuck = true;

}