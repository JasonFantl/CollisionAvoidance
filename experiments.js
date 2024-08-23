
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
      break;
    }

    for (let i = 0; i < boids.length; i++) {
      boids[i].observeVelocities(boids);
      config.policy.run(i, boids);
    }

    for (let i = 0; i < boids.length; i++) {
      boids[i].move();

      for (let j = i + 1; j < boids.length; j++) {
        if (dist(boids[i].position.x, boids[i].position.y, boids[j].position.x, boids[j].position.y) < boids[i].radius + boids[j].radius) {
          boids[i].collided = true;
          boids[j].collided = true;
          times[i] = "collided";
          times[j] = "collided";
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
  let config_name = extractNameFromConfig(config);
  const filename = `${config_name}-results.json`;

  save(results, filename);

  console.log(`Results saved for ${config_name}: ${filename}`);
}