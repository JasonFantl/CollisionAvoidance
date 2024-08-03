class Policies {
  // persue the goal
  static noCollision(boid) {
    boid.acceleration = createVector(); // zero acceleration

    boid.nextVelocity = p5.Vector.sub(boid.goal, boid.position).normalize();
  }

  // persue the goal, but push away from the closest boid
  static avoidClosest(boid, boids) {
    boid.acceleration = createVector(); // zero acceleration

    let closest_boid = null;
    let clostest_boid_distance = null;
    for (let other_boid of boids) {
      if (other_boid == boid) {
        continue;
      }
      let other_boid_distance = p5.Vector.sub(
        boid.position,
        other_boid.position
      ).mag();
      if (
        closest_boid == null ||
        other_boid_distance < clostest_boid_distance
      ) {
        closest_boid = other_boid;
        clostest_boid_distance = other_boid_distance;
      }
    }

    let avoid_vector_mag =
      (boid.radius + closest_boid.radius) / clostest_boid_distance;
    let avoid_vector = p5.Vector.sub(
      boid.position,
      closest_boid.position
    ).setMag(avoid_vector_mag);

    let to_goal_vector = p5.Vector.sub(boid.goal, boid.position).normalize();

    let move_vector = p5.Vector.add(to_goal_vector, avoid_vector);
    if (move_vector.mag() > 1) {
      move_vector.normalize();
    }
    boid.nextVelocity = move_vector;
  }

  static velocityObstacle(boid, boids) {
    boid.acceleration = createVector();

    let goal_vector = p5.Vector.sub(boid.goal, boid.position).normalize();

    boid.nextVelocity = goal_vector; // may be replaced later if there is an obstacle

    strokeWeight(0.5);
    let v_scale = 40;
    stroke(0);
    line(
      boid.position.x,
      boid.position.y,
      boid.position.x + goal_vector.x * v_scale / 2,
      boid.position.y + goal_vector.y * v_scale / 2
    );

    for (let other_boid of boids) {
      if (other_boid == boid) {
        continue;
      }

      let velocity_obstacle = new VelocityObstacle(boid, other_boid);


      let o = p5.Vector.add(
        boid.position,
        p5.Vector.mult(velocity_obstacle.origin, v_scale)
      );
      line(
        o.x,
        o.y,
        o.x + velocity_obstacle.left_ray.x * 100,
        o.y + velocity_obstacle.left_ray.y * 100
      );
      line(
        o.x,
        o.y,
        o.x + velocity_obstacle.right_ray.x * 100,
        o.y + velocity_obstacle.right_ray.y * 100
      );

      if (velocity_obstacle.contains(goal_vector)) {

        // the closest velocity will be one of the two projections onto each ray
        let left_projection = p5.Vector.mult(
          velocity_obstacle.left_ray,
          p5.Vector.sub(goal_vector, velocity_obstacle.origin).dot(
            velocity_obstacle.left_ray
          )
        ).add(velocity_obstacle.origin);
        let right_projection = p5.Vector.mult(
          velocity_obstacle.right_ray,
          p5.Vector.sub(goal_vector, velocity_obstacle.origin).dot(
            velocity_obstacle.right_ray
          )
        ).add(velocity_obstacle.origin);

        circle(
          boid.position.x + left_projection.x * v_scale,
          boid.position.y + left_projection.y * v_scale,
          10
        );
        circle(
          boid.position.x + right_projection.x * v_scale,
          boid.position.y + right_projection.y * v_scale,
          10
        );

        // choose the closest velocity to the original velocity that's also still within our speedlimit
        let left_projection_dist = p5.Vector.sub(
          left_projection,
          goal_vector
        ).mag();
        let right_projection_dist = p5.Vector.sub(
          right_projection,
          goal_vector
        ).mag();

        if (
          left_projection_dist < right_projection_dist &&
          left_projection_dist < 1
        ) {
          boid.nextVelocity = left_projection;
        } else if (
          right_projection_dist < left_projection_dist &&
          right_projection_dist < 1
        ) {
          boid.nextVelocity = right_projection;
        } else if (left_projection_dist < right_projection_dist) {
          // neither projection is within the speed limit, so choose the closest and normalize and hope for the best
          boid.nextVelocity = left_projection.normalize();
        } else if (right_projection_dist < left_projection_dist) {
          boid.nextVelocity = right_projection.normalize();
        } else {
          print("Should not reach here.");
          boid.nextVelocity = createVector();
        }
      }
    }

    stroke(100, 100, 100);
    line(
      boid.position.x,
      boid.position.y,
      boid.position.x + boid.nextVelocity.x * v_scale,
      boid.position.y + boid.nextVelocity.y * v_scale
    );
  }
}
