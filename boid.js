class Boid {
  constructor(position, goal, color, radius = 10, evasion_strength = 50.0, max_speed = 3, check_collisions_in_time = 99999) {
    this.position = position;
    this.velocity = goal.copy().setMag(max_speed);
    this.target_velocity = this.velocity.copy();
    this.acceleration = createVector(); // for dampening

    this.radius = radius;
    this.max_speed = max_speed;
    this.viewing_resolution = 512;

    this.check_collisions_in_time = check_collisions_in_time; // NOTE: control time to consider collisions
    this.base_evasion_strength = evasion_strength;
    this.evasion_strength = evasion_strength;
    this.evasion_strength_decay_start = 100.0;

    this.goal = goal;
    this.color = color;
    this.trail = [];
    this.collided = false;
    this.at_goal = false;

    this.debug_draw;
  }

  move() {
    if (freeze_time) {
      return;
    }

    if (this.collided) {
      this.target_velocity = createVector(); // zero vector
      this.velocity = createVector(); // zero vector
    } else {

      // NOTE: Update the velocities in response to each other slowly
      if (frameCount % 1 == 0) {

        // critically damped oscillator smoothing of velocity
        let k = 0.4;
        let damping_factor = 2 * sqrt(k);
        let acceleration_delta = p5.Vector.mult(
          this.acceleration,
          -damping_factor
        ).sub(
          p5.Vector.sub(
            this.velocity,
            this.target_velocity
          ).mult(k)
        );
        this.acceleration.add(acceleration_delta.mult(dt));
        this.velocity.add(p5.Vector.mult(this.acceleration, dt));

        // NOTE: update dynamic evasion strength
        // smaller the closer to the goal we are
        let dist_to_goal = this.position.dist(this.goal);
        this.evasion_strength = this.base_evasion_strength * min(1, dist_to_goal / this.evasion_strength_decay_start);

      }

      // verlet integration
      this.velocity.add(p5.Vector.fromAngle(random(TWO_PI)).mult(random(0.1))); // NOTE: Add noise to velocity
      this.position.add(p5.Vector.mult(this.velocity, dt));

      if (dist(this.position.x, this.position.y, this.goal.x, this.goal.y) < this.radius) {
        this.at_goal = true;
      }

    }
    if (frameCount % 5 == 0) {
      this.trail.push(this.position.copy());
      if (this.trail.length > 100) {
        this.trail.shift();
      }
    }
  }

  drawBoid() {

    fill(this.color);
    noStroke();

    if (this.collided) {
      strokeWeight(3);
      stroke(0, 0, 100);
    }

    circle(this.position.x, this.position.y, this.radius * 2);
  }

  drawTrail() {
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
}