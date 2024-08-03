class Boid {
  constructor(positon, goal, color) {
    this.position = positon;
    this.velocity = createVector();
    this.nextVelocity = createVector();

    this.radius = 10;

    this.goal = goal;
    this.color = color;
    this.trail = [];
  }

  move() {

    if (dist(this.position.x, this.position.y, this.goal.x, this.goal.y) < this.radius / 2) {
      this.nextVelocity = createVector();
    }
    // verlet integration
    this.velocity = this.nextVelocity;
    this.velocity.add(p5.Vector.random2D().mult(random(0.1))); // noise is needed to avoid unstable equilibriums
    this.position.add(p5.Vector.mult(this.velocity, dt));

    if (frameCount % 5 == 0) {
      this.trail.push(this.position.copy());
    }
  }

  draw() {
    fill(this.color);
    noStroke();
    circle(this.position.x, this.position.y, this.radius);

    strokeWeight(0.5);
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

function mousePressed() {
  boids[0].goal = createVector(mouseX - width / 2, mouseY - height / 2);
}
