class Boid {
  constructor(positon, goal, color) {
    this.position = positon;
    this.velocity = goal.copy().normalize();
    this.nextVelocity = createVector();

    this.radius = 10;
    this.check_collisions_in_time = 9999; // NOTE: control time to consider collisions
    this.evasion_strength = 999999999999.0

    this.observed_velocities = {};

    this.goal = goal;
    this.color = color;
    this.trail = [];

    this.collided = false;
  }

  move() {

    if (dist(this.position.x, this.position.y, this.goal.x, this.goal.y) < this.radius / 2) {
      this.nextVelocity = createVector();
    }

    // NOTE: Update the velocities in response to each other slowly
    if (frameCount % 1 == 0) {
      this.velocity = this.nextVelocity;
    }

    // verlet integration
    if (!freeze_time) {
      // NOTE: Add noise to velocity
      this.velocity.add(p5.Vector.random2D().mult(random(0.01)));
      this.position.add(p5.Vector.mult(this.velocity, dt));
    }

    if (frameCount % 5 == 0) {
      this.trail.push(this.position.copy());
      if (this.trail.length > 100) {
        this.trail.shift();
      }
    }
  }

  draw() {
    fill(this.color);
    noStroke();
    if (this.collided) {
      strokeWeight(2);
      stroke(200, 255, 255);
    }
    circle(this.position.x, this.position.y, this.radius * 2);

    strokeWeight(1);
    noFill();
    stroke(100);
    stroke(this.color);
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();
  }

  observeVelocities(boids) {
    const alpha = 0.1; // Smoothing factor

    for (let other_boid_index = 0; other_boid_index < boids.length; other_boid_index++) {
      const other_boid = boids[other_boid_index];

      if (other_boid === this) {
        continue;
      }

      let previous_average = this.observed_velocities[other_boid_index] || other_boid.velocity.copy();

      // Calculate the new average using correct vector operations
      let weighted_current = p5.Vector.mult(other_boid.velocity, alpha);
      let weighted_previous = p5.Vector.mult(previous_average, 1 - alpha);

      // Apply rolling average by adding the weighted vectors
      let new_average = p5.Vector.add(weighted_current, weighted_previous);

      // Update observed velocity with the new average
      this.observed_velocities[other_boid_index] = new_average;
    }
  }

}