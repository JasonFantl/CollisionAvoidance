function collisionConeAngle(position, radius) {
  let positionMag = position.mag();
  let fraction = constrain(radius / positionMag, -1, 1);
  let deltaAngle = asin(fraction);
  return 2 * deltaAngle;
}

// relative to the position of boid_A
class VelocityObstacle {
  constructor(boid_A, boid_B) {
    let safety_margin_factor = 1.1;
    let relativePosition = p5.Vector.sub(boid_B.position, boid_A.position);
    let angleToPosition = atan2(relativePosition.y, relativePosition.x);
    let coneAngle = collisionConeAngle(
      relativePosition,
      (boid_A.radius + boid_B.radius) * safety_margin_factor
    );

    // NOTE: Swap from VO to RVO
    // // VO 
    // this.origin = boid_B.velocity.copy(); 
    // RVO
    let alpha = 0.5;
    this.origin = p5.Vector.add(p5.Vector.mult(boid_A.velocity, alpha), p5.Vector.mult(boid_B.velocity, 1 - alpha));

    this.left_ray = p5.Vector.fromAngle(angleToPosition + coneAngle / 2);
    this.right_ray = p5.Vector.fromAngle(angleToPosition - coneAngle / 2);
  }

  // TODO: Optimize this calculation. WARNING! This needs to be carefully implemented, covering edge cases like >= 180 degree rays.
  contains(position) {
    let angle_to_right_ray = (this.left_ray.angleBetween(this.right_ray) + TWO_PI) % TWO_PI;
    let angle_to_in_ray = (this.left_ray.angleBetween(p5.Vector.sub(position, this.origin)) + TWO_PI) % TWO_PI;

    return angle_to_right_ray < angle_to_in_ray;
  }
}
