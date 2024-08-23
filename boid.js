class Boid {
  constructor(position, goal, color, radius = 10, max_speed = 2, evasion_strength = 50.0, check_collisions_in_time = 99999) {
    this.position = position;
    this.velocity = goal.copy().setMag(max_speed);
    this.next_velocity = this.velocity.copy();

    this.radius = radius;
    this.max_speed = max_speed;
    this.viewing_resolution = 512;

    this.check_collisions_in_time = check_collisions_in_time; // NOTE: control time to consider collisions
    this.evasion_strength = evasion_strength;

    this.observed_velocities = {};
    this.observed_velocities_smoothing_velocity = createVector();

    this.goal = goal;
    this.color = color;
    this.trail = [];
    this.collided = false;
    this.at_goal = false;
  }

  move() {
    if (this.at_goal) {
      this.next_velocity = createVector(); // zero vector
    }

    // NOTE: Update the velocities in response to each other slowly
    if (frameCount % 1 == 0) {
      this.velocity = this.next_velocity;
    }

    if (!this.at_goal) {
      // verlet integration
      if (!freeze_time) {
        this.velocity.add(p5.Vector.fromAngle(random(TWO_PI)).mult(random(0.1))); // NOTE: Add noise to velocity
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

      let k = 0.1;
      let damping_factor = 2 * sqrt(k);
      let force = p5.Vector.mult(
        this.observed_velocities_smoothing_velocity,
        -damping_factor
      ).sub(
        p5.Vector.sub(
          previous_average,
          other_boid.velocity
        ).mult(k)
      );
      this.observed_velocities_smoothing_velocity.add(force.mult(dt));
      this.observed_velocities[other_boid_index] = p5.Vector.add(
        previous_average,
        p5.Vector.mult(this.observed_velocities_smoothing_velocity, dt)
      );
    }
  }
}