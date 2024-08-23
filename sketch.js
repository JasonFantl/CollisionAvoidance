
let dt = 1.0;

let boids = [];

const goldenRatio = 1.61803398874989484820458683436;

let live_config;

function setup() {
  createCanvas(300, 300);
  colorMode(HSB, 255);
  frameRate(30);

  live_config = Configurations.circle_velocityObject;

  // runExperiments(live_config, 1);
  // runExperiments(Configurations.circle_avoidClosest, 10);
  // runExperiments(Configurations.circle_velocityObject, 10);

  randomSeed(0);
  boids = live_config.initialization.initialize();
}

let freeze_time = false

function draw() {
  translate(width / 2, height / 2);
  background(255);

  freeze_time = keyIsPressed;

  for (const boid of boids) {
    if (boid.collided || boid.at_goal) continue;
    live_config.policy.run(boid, boids, draw_debug = true);
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
