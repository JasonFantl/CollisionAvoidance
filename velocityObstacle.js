function collisionConeAngle(position, radius) {
  let positionMag = position.mag();
  let fraction = constrain(radius / positionMag, -1, 1);
  let deltaAngle = asin(fraction);
  return 2 * deltaAngle;
}

// relative to the position of boid_A
class VelocityObstacle {
  constructor(boid_A_index, boid_B_index, boids, collision_time_threshold) {
    let boid_A = boids[boid_A_index];
    let boid_B = boids[boid_B_index];

    let safety_margin_factor = 5;
    this.collision_radius = (boid_A.radius + boid_B.radius) + safety_margin_factor;
    this.collision_position = p5.Vector.sub(boid_B.position, boid_A.position);
    let angle_to_position = atan2(this.collision_position.y, this.collision_position.x);
    let cone_angle = collisionConeAngle(this.collision_position, this.collision_radius);

    // NOTE: Swap from VO to RVO

    let other_velocity = boid_A.observed_velocities[boid_B_index].copy();
    // let other_velocity = boid_B.velocity.copy();

    // VO
    this.cone_origin = other_velocity;

    // // RVO WARNING: This only works when the other agent is using RVO.
    // let alpha = 0.5;
    // // NOTE: Can we get closer to VO the less responsive this person is?
    // // this.cone_origin = p5.Vector.add(p5.Vector.mult(boid_A.velocity, alpha), p5.Vector.mult(boid_B.velocity, 1 - alpha));
    // this.cone_origin = p5.Vector.add(p5.Vector.mult(boid_A.velocity, alpha), p5.Vector.mult(other_velocity, 1 - alpha));

    this.left_ray = p5.Vector.fromAngle(angle_to_position + cone_angle / 2);
    this.right_ray = p5.Vector.fromAngle(angle_to_position - cone_angle / 2);

    this.truncation_center = p5.Vector.div(this.collision_position, collision_time_threshold); // relative to origin
    this.truncation_radius = this.collision_radius / collision_time_threshold;
  }

  // TODO: Optimize this calculation. WARNING! This needs to be carefully implemented, covering edge cases like >= 180 degree rays.
  contains(position) {
    let relative_position = p5.Vector.sub(position, this.cone_origin);
    let angle_to_right_ray = (this.left_ray.angleBetween(this.right_ray) + TWO_PI) % TWO_PI;
    let angle_to_in_ray = (this.left_ray.angleBetween(relative_position) + TWO_PI) % TWO_PI;
    let in_cone = angle_to_right_ray < angle_to_in_ray;

    let past_truncation_zone = relative_position.mag() > this.truncation_center.mag();
    let in_truncation_zone = this.truncation_center.dist(relative_position) < this.truncation_radius;

    return in_cone && (past_truncation_zone || in_truncation_zone);
  }
}
