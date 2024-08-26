
let dt = 1.0;

const goldenRatio = 1.61803398874989484820458683436;

let experiment;

function setup() {
  createCanvas(300, 300);
  colorMode(HSB, 255);
  frameRate(30);

  // experiment = new Experiment(Initializations.circle(20), Policies.avoidClosest, 2.2);
  // experiment = new Experiment(Initializations.circle(5), Policies.velocityObstacle, 50.0);
  // experiment = new Experiment(Initializations.straightOnPair(), Policies.avoidClosest, boid_radius = 5, evasion_strength = 2);
  // experiment = new Experiment(Initializations.straightOnPair(), Policies.velocityObstacle, boid_radius = 10.0, evasion_strength = 100.0);

  // experiment = new Experiment(Initializations.parallelLinesOneAcross(12), Policies.velocityObstacle, 20.0);
  // experiment = new Experiment(Initializations.parallelLinesOneAcross(12), Policies.avoidClosest, 2.0);
  // experiment = new Experiment(Initializations.differentDistancesPair(), Policies.velocityObstacle, 10.0);
  // experiment = new Experiment(Initializations.tunnel(4), Policies.velocityObstacle, 20.0);

  // experiment = new Experiment(Initializations.circle(50), Policies.velocityObstacle, boid_radius = 5, evasion_strength = 50.0);
  experiment = new Experiment(Initializations.circle(50), Policies.avoidClosest, boid_radius = 5, evasion_strength = 30.0);
  // experiment = new Experiment(Initializations.circle(10), Policies.velocityObstacle, boid_radius = 30, evasion_strength = 50.0,);

  // runExperiments(experiment, 10);
  // runExperiments(new Experiment(Initializations.circle(10), Policies.avoidClosest, 2.0), 10);
  // runExperiments(Configurations.circle_velocityObject, 10);

  // runExperiments(new Experiment(Initializations.circle(10), Policies.noCollision), 10);
  // runExperiments(new Experiment(Initializations.circle(10), Policies.avoidClosest, 2.0), 10);
  // runExperiments(new Experiment(Initializations.circle(10), Policies.velocityObstacle, 50.0), 10);
  // runExperiments(new Experiment(Initializations.circle(10), Policies.velocityObstacle, 100.0), 10);
  // runExperiments(new Experiment(Initializations.circle(10), Policies.velocityObstacle, "adaptive"), 10);

  experiment.initialize(0);

  createLoop({ duration: 16, gif: true })

}

let freeze_time = false

function draw() {
  translate(width / 2, height / 2);
  background(255);

  freeze_time = keyIsPressed;

  experiment.step(false);

  // draw the experiment
  for (let i = 0; i < experiment.boids.length; i++) {
    experiment.boids[i].drawTrail();
  }
  for (let i = 0; i < experiment.boids.length; i++) {
    experiment.boids[i].drawBoid();

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
