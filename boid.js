class Boid {
  constructor(positon, goal, color) {
    this.position = positon;
    this.velocity = goal.copy().normalize();
    this.nextVelocity = createVector();

    this.radius = 5;
    this.check_collisions_in_time = 100; // NOTE: control time to consider collisions

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
}
