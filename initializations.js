
const Initializations = {
  circle: (num_boids) => ({
    name: "circle",
    num_boids: num_boids,
    initialize: (boid_radius, evasion_strength) => {
      let boids = [];
      for (let i = 0; i < num_boids; i++) {
        let start_vector = p5.Vector.fromAngle(TWO_PI * i / num_boids).mult(width / 2.5);
        let goal_vector = p5.Vector.fromAngle(TWO_PI * i / num_boids).mult(-width / 2.5);
        boids.push(new Boid(start_vector, goal_vector, color((255 * i / num_boids + 140) % 255, 255, 255), radius = boid_radius, evasion_strength = evasion_strength));
      }
      return boids;
    }
  }),
  parallelLines: (num_boids) => ({
    name: "parallel lines",
    num_boids: num_boids,
    initialize: (boid_radius, evasion_strength) => {
      let boids = [];
      for (let i = 0; i < num_boids; i++) {
        let h = round(num_boids / 2);
        let x = (width * (i % h) / (h - 1) - width / 2) * 0.8;
        let y = (int(i / h) * height - height / 2) * 0.8;
        let start_vector = createVector(x, y);
        let goal_vector = createVector(x, -y);
        boids.push(new Boid(start_vector, goal_vector, color((255 * i / num_boids + 140) % 255, 255, 255), radius = boid_radius, evasion_strength = evasion_strength));
      }
      return boids;
    }
  }),
  oppositeLines: (num_boids) => ({
    name: "opposite lines",
    num_boids: num_boids,
    initialize: (boid_radius, evasion_strength) => {
      let boids = [];
      let h = round(num_boids / 2);
      for (let i = 0; i < h; i++) {
        let x = (width * (i / h) / 3 - width / 2) * 0.9;
        let y = 0;
        boids.push(new Boid(createVector(x, y), createVector(-x, y), color((255 * i * 2 / num_boids) % 255, 255, 255), radius = boid_radius, evasion_strength = evasion_strength));
        boids.push(new Boid(createVector(-x, y), createVector(x, y), color((255 * (i * 2 + 1) / num_boids) % 255, 255, 255), radius = boid_radius, evasion_strength = evasion_strength));
      }
      return boids;
    }
  }),
  parallelLinesOneAcross: (num_boids) => ({
    name: "parallel lines one across",
    num_boids: num_boids,
    initialize: (boid_radius, evasion_strength) => {
      let boids = [];
      boids[0] = new Boid(createVector(-width * 0.45, 0), createVector(width * 0.45, 0), color(100, 255, 255), radius = boid_radius, evasion_strength = evasion_strength);
      boids[1] = new Boid(createVector(width * 0.45, 0), createVector(-width * 0.45, 0), color(200, 255, 255), radius = boid_radius, evasion_strength = evasion_strength);

      boids = boids.concat(Initializations.parallelLines(num_boids - 2).initialize(boid_radius, evasion_strength))

      return boids;
    }
  }),
  straightOnPair: () => ({
    name: "straight-on pair",
    num_boids: 2,
    initialize: (boid_radius, evasion_strength) => {
      return Initializations.circle(2).initialize(boid_radius, evasion_strength);
    }
  }),
  perpendicularPair: () => ({
    name: "perpendicular pair",
    num_boids: 2,
    initialize: (boid_radius, evasion_strength) => {
      let boids = [];
      for (let i = 0; i < 2; i++) {
        let start_vector = p5.Vector.fromAngle(TWO_PI * i / 4).mult(width / 2.5);
        let goal_vector = p5.Vector.fromAngle(TWO_PI * i / 4).mult(-width / 2.5);

        boids[i] = new Boid(start_vector, goal_vector, color(255 * i / 2, 255, 255), radius = boid_radius, evasion_strength = evasion_strength);
      }
      return boids;
    }
  }),
  differentDistancesPair: () => ({
    name: "different distances pair",
    num_boids: 2,
    initialize: (boid_radius, evasion_strength) => {
      let boids = [];

      boids[0] = new Boid(createVector(-width * 0.4, 0), createVector(width * 0.4, 0), color(0, 255, 255), radius = boid_radius, evasion_strength = evasion_strength);
      boids[1] = new Boid(createVector(0, 0), createVector(-width * 0.4, 0), color(100, 255, 255), radius = boid_radius, evasion_strength = evasion_strength);

      return boids;
    }
  }),
  obstaclePair: () => ({
    name: "obstacle pair",
    num_boids: 2,
    initialize: (boid_radius, evasion_strength) => {
      let boids = [];

      boids[0] = new Boid(createVector(0, height / 2.5), createVector(0, -height / 2.5), color(0, 255, 255), radius = boid_radius, evasion_strength = evasion_strength);
      boids[1] = new Boid(createVector(10, 0), createVector(10, 0), color(0, 0, 100), radius = boid_radius, evasion_strength = evasion_strength);

      return boids;
    }
  }),
}