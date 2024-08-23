
function runExperiment(config) {
  let boids = config.initialization.initialize();

  // set all the evasion strengths
  for (let i = 0; i < boids.length; i++) {
    boids[i].evasion_strength = config.evasion_strength;
  }

  let timeTaken = 0;
  let times = {};
  while (boids.some(boid => !boid.at_goal)) {
    timeTaken++;
    if (timeTaken > 1000) {
      print("WARNING:: Failed to finish the experiment!")
      return "Timeout";
    }

    for (let i = 0; i < boids.length; i++) {
      boids[i].observeVelocities(boids);
      config.policy.run(i, boids);
    }

    for (let i = 0; i < boids.length; i++) {
      boids[i].move();

      for (let j = i + 1; j < boids.length; j++) {
        if (dist(boids[i].position.x, boids[i].position.y, boids[j].position.x, boids[j].position.y) < boids[i].radius + boids[j].radius) {
          return "Collision"
        }
      }

      if (boids[i].at_goal && !(i in times)) {
        times[i] = timeTaken;
      }
    }
  }

  return times;
}

function runExperiments(config, numExperiments) {
  let results = [];

  for (let trial = 0; trial < numExperiments; trial++) {
    print("Running trial", trial)
    randomSeed(trial);
    results.push(runExperiment(config));
  }

  saveResults(config, results);
}

function saveResults(config, results) {
  const filename = `${config.name()}-results.json`;

  save(results, filename);

  console.log(`Results saved for ${config.name()}: ${filename}`);
}