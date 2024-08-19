class Policies {
  // persue the goal
  static noCollision(boid) {
    boid.acceleration = createVector(); // zero acceleration

    boid.nextVelocity = p5.Vector.sub(boid.goal, boid.position).normalize();
  }

  // pursue the goal, but push away from the closest boid
  static avoidClosest(boid_index, boids) {
    const boid = boids[boid_index];

    boid.acceleration = createVector(); // zero acceleration

    let closest_boid = null;
    let closest_boid_distance = null;
    for (let other_boid_index = 0; other_boid_index < boids.length; other_boid_index++) {
      if (other_boid_index == boid_index) {
        continue;
      }
      const other_boid = boids[other_boid_index];

      let other_boid_distance = p5.Vector.sub(
        boid.position,
        other_boid.position
      ).mag();
      if (
        closest_boid == null ||
        other_boid_distance < closest_boid_distance
      ) {
        closest_boid = other_boid;
        closest_boid_distance = other_boid_distance;
      }
    }

    let avoid_vector_mag =
      2 * (boid.radius + closest_boid.radius) / closest_boid_distance;
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

  static velocityObstacle(boid_index, boids) {
    const boid = boids[boid_index];

    boid.acceleration = createVector();

    let preferred_velocity = p5.Vector.sub(boid.goal, boid.position).normalize();

    boid.nextVelocity = preferred_velocity; // may be overwritten later if there is an obstacle

    let scale_debug_display = 40;
    let draw_debug = true;

    // union all the velocity obstacles
    let velocity_obstacles = []
    for (let other_boid_index = 0; other_boid_index < boids.length; other_boid_index++) {
      if (other_boid_index == boid_index) {
        continue;
      }
      const other_boid = boids[other_boid_index];

      let velocity_obstacle = new VelocityObstacle(boid_index, other_boid_index, boid.check_collisions_in_time);
      velocity_obstacles.push(velocity_obstacle);

      // draw velocity obstacle cone
      if (draw_debug) {
        stroke(other_boid.color);
        strokeWeight(0.5);
        let velocity_obstacle_absolute_position = p5.Vector.add(
          boid.position,
          p5.Vector.mult(velocity_obstacle.cone_origin, scale_debug_display)
        );
        line(
          velocity_obstacle_absolute_position.x,
          velocity_obstacle_absolute_position.y,
          velocity_obstacle_absolute_position.x + velocity_obstacle.left_ray.x * scale_debug_display,
          velocity_obstacle_absolute_position.y + velocity_obstacle.left_ray.y * scale_debug_display
        );
        line(
          velocity_obstacle_absolute_position.x,
          velocity_obstacle_absolute_position.y,
          velocity_obstacle_absolute_position.x + velocity_obstacle.right_ray.x * scale_debug_display,
          velocity_obstacle_absolute_position.y + velocity_obstacle.right_ray.y * scale_debug_display
        );
      }
    }


    // find a new velocity outside all the velocity obstacles. We use sampling here, but a linear program would be better
    let best_sample_velocity = null;
    let lowest_sample_penalty = Infinity;
    let sample_magnitude_resolution = 10;
    let sample_angle_resolution = 64;
    for (let sample_magnitude = 0.0; sample_magnitude <= 1.0; sample_magnitude += 1.0 / sample_magnitude_resolution) {
      for (let sample_angle = -PI; sample_angle <= PI; sample_angle += TWO_PI / sample_angle_resolution) {

        let sample_velocity = p5.Vector.fromAngle(sample_angle).mult(sample_magnitude);

        let sample_velocity_alignment_penalty = p5.Vector.dist(sample_velocity, preferred_velocity);

        let time_to_collision_penalty = 0;
        let closest_time_to_collision = Infinity;
        for (let velocity_obstacle of velocity_obstacles) {
          if (velocity_obstacle.contains(sample_velocity)) {
            let estimated_distance = velocity_obstacle.collision_position.mag() - velocity_obstacle.collision_radius;
            let estimated_speed = p5.Vector.sub(sample_velocity, velocity_obstacle.cone_origin).mag();
            closest_time_to_collision = min(closest_time_to_collision, estimated_distance / estimated_speed);
          }
        }
        if (closest_time_to_collision > 0) {
          time_to_collision_penalty = boid.evasion_strength / closest_time_to_collision;
        } else {
          time_to_collision_penalty = Infinity;
        }

        let sample_velocity_penalty = time_to_collision_penalty + sample_velocity_alignment_penalty;

        // draw sampled point
        if (draw_debug) {
          stroke(0, 0, sample_velocity_penalty * 10);
          strokeWeight(1);
          point(boid.position.x + sample_velocity.x * scale_debug_display, boid.position.y + sample_velocity.y * scale_debug_display);
        }

        if (sample_velocity_penalty < lowest_sample_penalty) {
          best_sample_velocity = sample_velocity;
          lowest_sample_penalty = sample_velocity_penalty;
        }
      }
    }

    if (best_sample_velocity != null) {
      boid.nextVelocity = best_sample_velocity;
    } else { // no valid velocities were found
      boid.nextVelocity = createVector();
    }

    // draw proffered and selected velocity
    if (draw_debug) {
      stroke(boid.color);

      strokeWeight(0.5);
      stroke(boid.color);
      line(
        boid.position.x,
        boid.position.y,
        boid.position.x + preferred_velocity.x * scale_debug_display,
        boid.position.y + preferred_velocity.y * scale_debug_display
      );

      strokeWeight(2);
      line(
        boid.position.x,
        boid.position.y,
        boid.position.x + boid.nextVelocity.x * scale_debug_display,
        boid.position.y + boid.nextVelocity.y * scale_debug_display
      );
    }
  }
}
