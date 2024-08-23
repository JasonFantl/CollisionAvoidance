
let dt = 1.0;

const goldenRatio = 1.61803398874989484820458683436;

let experiment;

function setup() {
  createCanvas(300, 300);
  colorMode(HSB, 255);
  frameRate(30);

  // experiment = new Experiment(Initializations.circle(20), Policies.avoidClosest, 2.2);
  experiment = new Experiment(Initializations.straightOnPair(), Policies.avoidClosest, 1.5);

  runExperiments(experiment, 10);
  // runExperiments(new Experiment(Initializations.circle(10), Policies.avoidClosest, 2.0), 10);
  // runExperiments(Configurations.circle_velocityObject, 10);

  // runExperiments(new Experiment(Initializations.circle(10), Policies.noCollision), 10);
  // runExperiments(new Experiment(Initializations.circle(10), Policies.avoidClosest, 2.0), 10);
  // runExperiments(new Experiment(Initializations.circle(10), Policies.velocityObstacle, 50.0), 10);
  // runExperiments(new Experiment(Initializations.circle(10), Policies.velocityObstacle, 100.0), 10);
  // runExperiments(new Experiment(Initializations.circle(10), Policies.velocityObstacle, "adaptive"), 10);

  experiment.initialize(0);
}

let freeze_time = false

function draw() {
  translate(width / 2, height / 2);
  background(255);

  freeze_time = keyIsPressed;

  experiment.step();

  // draw the experiment
  for (let i = 0; i < experiment.boids.length; i++) {
    experiment.boids[i].draw();

    for (let j = i + 1; j < experiment.boids.length; j++) {
      if (experiment.boids[i].position.dist(experiment.boids[j].position) < experiment.boids[i].radius + experiment.boids[j].radius) {
        experiment.boids[i].collided = true;
        experiment.boids[j].collided = true;
      }
    }
  }
}

function mousePressed() {
  experiment.boids[0].goal = createVector(mouseX - width / 2, mouseY - height / 2);
}
