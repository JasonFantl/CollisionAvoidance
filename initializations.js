
const Initializations = {
  circle: (num_boids) => ({
    name: "circle",
    num_boids: num_boids,
    initialize: () => {
      let boids = [];
      for (let i = 0; i < num_boids; i++) {
        let start_vector = p5.Vector.fromAngle(TWO_PI * i / num_boids).mult(width / 2.5);
        let goal_vector = p5.Vector.fromAngle(TWO_PI * i / num_boids).mult(-width / 2.5);
        boids.push(new Boid(start_vector, goal_vector, color((255 * i / num_boids + 140) % 255, 255, 255)));
      }
      return boids;
    }
  }),
  straightOnPair: () => ({
    name: "straight-on pair",
    num_boids: 2,
    initialize: () => {
      return initializeCircle(2);
    }
  }),
  perpendicularPair: () => ({
    name: "perpendicular pair",
    num_boids: 2,
    initialize: () => {
      let boids = [];
      for (let i = 0; i < 2; i++) {
        let start_vector = p5.Vector.fromAngle(TWO_PI * i / 4).mult(width / 2.5);
        let goal_vector = p5.Vector.fromAngle(TWO_PI * i / 4).mult(-width / 2.5);

        boids[i] = new Boid(start_vector, goal_vector, color(255 * i / 2, 255, 255));
      }
      return boids;
    }
  })
}