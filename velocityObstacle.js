function collisionConeAngle(position, radius) {
  let positionMag = position.mag();
  let fraction = constrain(radius / positionMag, -1, 1);
  let deltaAngle = asin(fraction);
  return deltaAngle;
}

// relative to th eposition of boid_A
class VelocityObstacle {
  constructor(boid_A, boid_B) {
    let relativePosition = p5.Vector.sub(boid_B.position, boid_A.position);
    let angleToPosition = atan2(relativePosition.y, relativePosition.x);
    let coneAngle = collisionConeAngle(
      relativePosition,
      boid_A.radius + boid_B.radius
    );

    this.origin = boid_B.velocity.copy();
    this.left_ray = p5.Vector.fromAngle(angleToPosition + coneAngle / 2);
    this.right_ray = p5.Vector.fromAngle(angleToPosition - coneAngle / 2);
      }

  contains(position) {
    let A = this.left_ray;
    let B = this.right_ray;
    let C = p5.Vector.sub(position, this.origin).normalize();

    return A.dot(C) >= A.dot(B) && B.dot(C) >= A.dot(B);
  }
}
