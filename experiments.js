

class Experiment {
  constructor(initialization, policy, boid_radius = 10.0, evasion_strength = 1.0) {
    this.initialization = initialization;
    this.policy = policy;
    this.evasion_strength = evasion_strength;
    this.boid_radius = boid_radius;

    this.boids;
  }

  initialize(seed) {
    randomSeed(seed);

    this.boids = this.initialization.initialize(this.boid_radius, this.evasion_strength);
  }

  step() {
    for (const boid of this.boids) {
      if (boid.collided) continue;
      this.policy.run(boid, this.boids);
    }

    for (const boid of this.boids) {
      boid.move();
    }
  }

  name() {
    let maybe_evasion_string = this.evasion_strength != null ? `-evasion ${this.evasion_strength}` : '';
    return `${this.initialization.num_boids} nodes-${this.initialization.name}-${this.policy.name}${maybe_evasion_string}`;
  }
}


function runExperiment(experiment, seed) {
  experiment.initialize(seed);

  let timeTaken = 0;
  let times = {};

  while (experiment.boids.some(boid => !boid.at_goal)) {
    timeTaken++;
    if (timeTaken > 1000) {
      print("WARNING:: Failed to finish the experiment!")
      return "Timeout";
    }

    experiment.step();

    for (let i = 0; i < experiment.boids.length; i++) {
      experiment.boids[i].draw();

      for (let j = i + 1; j < experiment.boids.length; j++) {
        if (experiment.boids[i].position.dist(experiment.boids[j].position) < experiment.boids[i].radius + experiment.boids[j].radius) {
          return "Collision"
        }
      }

      if (experiment.boids[i].at_goal && !(i in times)) {
        times[i] = timeTaken;
      }
    }
  }

  return times;
}

function runExperiments(experiment, numTrials) {
  let results = [];

  for (let trial_index = 0; trial_index < numTrials; trial_index++) {
    print("Running trial", trial_index)
    results.push(runExperiment(experiment, trial_index));
  }

  saveResults(experiment, results);
}

function saveResults(experiment, results) {
  const filename = `${experiment.name()}-results.json`;

  save(results, filename);

  console.log(`Results saved for ${experiment.name()}: ${filename}`);
}