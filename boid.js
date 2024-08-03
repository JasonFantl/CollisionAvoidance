class Boid {
  constructor(positon, goal, color) {
    this.position = positon;
    this.velocity = createVector();
    this.acceleration = createVector();

    this.radius = 10;

    this.goal = goal;
    this.color = color;
    this.trail = [];
    
    this.stuck = false;
  }

  move() {
    if (this.stuck) {
      return;
    }
    
    if (dist(this.position.x, this.position.y, this.goal.x, this.goal.y) < this.radius/2) {
      return;
    }
    // verlet integration
    this.velocity.add(p5.Vector.mult(this.acceleration, dt));
    this.velocity.add(p5.Vector.random2D().mult(random(0.1)));
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
  boids[0].goal = createVector(mouseX - width/2, mouseY - height/2);
}
