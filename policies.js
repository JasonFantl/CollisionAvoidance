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

    boid.nextVelocity = goal_vector; // may be overwritten later if there is an obstacle

    strokeWeight(1);
    let v_scale = 40;
    // stroke(boid.color);
    // line(
    //   boid.position.x,
    //   boid.position.y,
    //   boid.position.x + goal_vector.x * v_scale,
    //   boid.position.y + goal_vector.y * v_scale
    // );

    // union all the velocity obstacles
    let velocity_obstacles = []
    for (let other_boid of boids) {
      if (other_boid == boid) {
        continue;
      }

      let velocity_obstacle = new VelocityObstacle(boid, other_boid);
      velocity_obstacles.push(velocity_obstacle);

      // draw them
      if (boid == boids[0]) {
        stroke(other_boid.color);
        strokeWeight(0.5);
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
      }
    }


    // find a new velocity outside all the velocity obstacles. We use sampling here, but a linear program would be better
    let best_sample_point = null;
    let best_sample_point_score = 0.0;
    let radius_resolution = 10;
    let angle_resolution = 32;
    for (let r = 0.1; r <= 1.0; r += 1.0 / radius_resolution) {
      for (let d_theta = - 3 * PI / 4; d_theta <= 3 * PI / 4; d_theta += PI / angle_resolution) {

        let sample_point = p5.Vector.rotate(goal_vector, d_theta).setMag(r);
        // NOTE: Influence always passing on the left by modifying the score to be a little higher on the left. Negative for right preference
        let left_passing_influence = -0.1;
        let sample_point_score = r * 10 - abs(d_theta + left_passing_influence / angle_resolution); // the closer to the goal_vector (r = 1.0, theta = 0) the better

        for (let velocity_obstacle of velocity_obstacles) {
          if (velocity_obstacle.contains(sample_point)) {
            // NOTE: we can include time-to-collision in the score here
            sample_point_score = -1;
            break;
          }
        }

        if (sample_point_score > best_sample_point_score) {
          best_sample_point = sample_point;
          best_sample_point_score = sample_point_score;
        }
      }
    }

    if (best_sample_point != null) {
      boid.nextVelocity = best_sample_point;
    } else { // no valid velocities were found
      boid.nextVelocity = createVector();
    }

    if (boid == boids[0]) {
      stroke(boid.color);
      strokeWeight(2);
      line(
        boid.position.x,
        boid.position.y,
        boid.position.x + boid.nextVelocity.x * v_scale,
        boid.position.y + boid.nextVelocity.y * v_scale
      );
    }
  }
}
