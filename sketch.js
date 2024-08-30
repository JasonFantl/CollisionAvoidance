
let dt = 1.0;

const goldenRatio = 1.61803398874989484820458683436;

let experiment;

function setup() {
  createCanvas(300, 300);
  colorMode(HSB, 255);
  frameRate(30);

  experiment = new Experiment(Initializations.circle(10), Policies.avoidClosest, boid_radius = 10, evasion_strength = 35.0);
  // experiment = new Experiment(Initializations.circle(10), Policies.velocityObstacle, boid_radius = 10, evasion_strength = 50.0);

  // experiment = new Experiment(Initializations.straightOnPair(), Policies.avoidClosest, boid_radius = 5, evasion_strength = 2);
  // experiment = new Experiment(Initializations.straightOnPair(), Policies.velocityObstacle, boid_radius = 20.0, evasion_strength = 10.0);
  // experiment = new Experiment(Initializations.perpendicularPair(), Policies.avoidClosest, boid_radius = 10.0, evasion_strength = 50.0);

  // experiment = new Experiment(Initializations.oppositeLines(12), Policies.avoidClosest, boid_radius = 5.0, evasion_strength = 35.0);
  // experiment = new Experiment(Initializations.parallelLinesOneAcross(18), Policies.avoidClosest, boid_radius = 10.0, evasion_strength = 30.0);
  // experiment = new Experiment(Initializations.parallelLinesOneAcross(12), Policies.avoidClosest, 2.0);
  // experiment = new Experiment(Initializations.differentDistancesPair(), Policies.velocityObstacle, 10.0);

  // experiment = new Experiment(Initializations.circle(50), Policies.velocityObstacle, boid_radius = 5, evasion_strength = 50.0);
  // experiment = new Experiment(Initializations.circle(50), Policies.avoidClosest, boid_radius = 5, evasion_strength = 30.0);
  // experiment = new Experiment(Initializations.circle(50), Policies.velocityObstacle, boid_radius = 30, evasion_strength = 50.0,);
  // createLoop({ duration: 16, gif: true })

  // experiment = new Experiment(Initializations.obstaclePair(), Policies.velocityObstacle, boid_radius = 20, evasion_strength = 6.0);
  // experiment = new Experiment(Initializations.obstaclePair(), Policies.avoidClosest, boid_radius = 20, evasion_strength = 50.0);
  createLoop({ duration: 8, gif: true })

  // runExperiments(experiment, 10);
  // runExperiments(new Experiment(Initializations.circle(10), Policies.avoidClosest, 2.0), 10);
  // runExperiments(Configurations.circle_velocityObject, 10);

  experiment.initialize(0);


}

let freeze_time = false

function draw() {
  translate(width / 2, height / 2);
  background(255);

  freeze_time = keyIsPressed;

  experiment.step(true);

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

  return;
  const scale_debug_display = 30;
  for (const boid of experiment.boids) {
    if (!boid.debug_draw) continue;
    if (boid.collided || boid.at_goal) continue;

    let max_penalty = 0;
    for (const sample_point of boid.debug_draw.sample_points) {
      if (sample_point.penalty == Infinity) sample_point.penalty = 999999;
      max_penalty = max(max_penalty, sample_point.penalty);
    }

    for (const sample_point of boid.debug_draw.sample_points) {
      stroke(0, 0, min(255, 255 * sample_point.penalty / max_penalty));
      strokeWeight(2);
      point(boid.position.x + sample_point.velocity.x * scale_debug_display, boid.position.y + sample_point.velocity.y * scale_debug_display);
    }

    for (const other_boid_velocity_object of boid.debug_draw.other_boids) {
      const other_boid = other_boid_velocity_object.other_boid;
      const velocity_obstacle = other_boid_velocity_object.velocity_obstacle;

      stroke(other_boid.color);
      strokeWeight(1);
      let velocity_obstacle_absolute_position = p5.Vector.add(
        boid.position,
        p5.Vector.mult(velocity_obstacle.cone_origin, scale_debug_display)
      );
      line(
        velocity_obstacle_absolute_position.x,
        velocity_obstacle_absolute_position.y,
        velocity_obstacle_absolute_position.x + velocity_obstacle.left_ray.x * scale_debug_display,
        velocity_obstacle_absolute_position.y + velocity_obstacle.left_ray.y * scale_debug_display
      );
      line(
        velocity_obstacle_absolute_position.x,
        velocity_obstacle_absolute_position.y,
        velocity_obstacle_absolute_position.x + velocity_obstacle.right_ray.x * scale_debug_display,
        velocity_obstacle_absolute_position.y + velocity_obstacle.right_ray.y * scale_debug_display
      );
    }

    // stroke(boid.color);

    // strokeWeight(0.5);
    // stroke(boid.color);
    // line(
    //   boid.position.x,
    //   boid.position.y,
    //   boid.position.x + preferred_velocity.x * scale_debug_display,
    //   boid.position.y + preferred_velocity.y * scale_debug_display
    // );

    // strokeWeight(2);
    // line(
    //   boid.position.x,
    //   boid.position.y,
    //   boid.position.x + boid.target_velocity.x * scale_debug_display,
    //   boid.position.y + boid.target_velocity.y * scale_debug_display
    // );

  }
}

function mousePressed() {
  experiment.boids[0].goal = createVector(mouseX - width / 2, mouseY - height / 2);
}
