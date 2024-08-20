class Boid {
  constructor(position, goal, color, evasion_strength = 50.0, check_collisions_in_time = 99999) {
    this.position = position;
    this.velocity = goal.copy().normalize();
    this.nextVelocity = createVector();

    this.radius = 10;
    this.max_speed = 2;

    this.check_collisions_in_time = check_collisions_in_time; // NOTE: control time to consider collisions
    this.evasion_strength = evasion_strength;

    this.observed_velocities = {};
    this.observed_velocities_smoothing_factor = 0.1;

    this.goal = goal;
    this.color = color;
    this.trail = [];

    this.collided = false;
    this.at_goal = false;

  }

  move() {

    // NOTE: Update the velocities in response to each other slowly
    if (frameCount % 1 == 0) {
      this.velocity = this.nextVelocity;
    }

    if (!this.at_goal) {
      // verlet integration
      if (!freeze_time) {
        // NOTE: Add noise to velocity
        this.velocity.add(p5.Vector.random2D().mult(random(0.1)));
        this.position.add(p5.Vector.mult(this.velocity, dt));
      }

      if (dist(this.position.x, this.position.y, this.goal.x, this.goal.y) < this.radius / 2) {
        this.at_goal = true;
      }

      if (frameCount % 5 == 0) {
        this.trail.push(this.position.copy());
        if (this.trail.length > 100) {
          this.trail.shift();
        }
      }
    }
  }

  draw() {

    fill(this.color);
    noStroke();

    if (this.collided) {
      strokeWeight(3);
      stroke(0, 0, 100);
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

    for (let other_boid_index = 0; other_boid_index < boids.length; other_boid_index++) {
      const other_boid = boids[other_boid_index];

      if (other_boid === this) {
        continue;
      }

      let previous_average = this.observed_velocities[other_boid_index] || other_boid.velocity.copy();

      // Calculate the new average using correct vector operations
      let weighted_current = p5.Vector.mult(other_boid.velocity, this.observed_velocities_smoothing_factor);
      let weighted_previous = p5.Vector.mult(previous_average, 1 - this.observed_velocities_smoothing_factor);

      // Apply rolling average by adding the weighted vectors
      let new_average = p5.Vector.add(weighted_current, weighted_previous);

      // Update observed velocity with the new average
      this.observed_velocities[other_boid_index] = new_average;
    }
  }

}