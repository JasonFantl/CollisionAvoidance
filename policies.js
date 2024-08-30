
const Policies = {
  noCollision: {
    name: "no collision",
    run: (boid, boids) => {
      boid.target_velocity = p5.Vector.sub(boid.goal, boid.position).setMag(boid.max_speed);
    }
  },

  avoidClosest: {
    name: "avoid closest",
    run: (boid, boids) => {

      let preferred_velocity = p5.Vector.sub(boid.goal, boid.position);
      let preferred_mag = preferred_velocity.mag();
      if (preferred_mag > boid.max_speed) {
        preferred_velocity.setMag(boid.max_speed);
      } else {
        preferred_velocity.setMag(boid.max_speed * pow(preferred_mag / boid.max_speed, 2));
      }


      let closest_boid = null;
      let closest_boid_distance = Infinity;
      for (const other_boid of boids) {
        if (other_boid == boid) continue;

        let other_boid_distance = boid.position.dist(other_boid.position) - (boid.radius + other_boid.radius);

        if (other_boid_distance < closest_boid_distance) {
          closest_boid = other_boid;
          closest_boid_distance = other_boid_distance;
        }
      }

      if (closest_boid_distance > 0) {
        avoid_vector_mag = boid.evasion_strength / closest_boid_distance;
        let avoid_vector = p5.Vector.sub(boid.position, closest_boid.position).setMag(avoid_vector_mag);

        let move_vector = p5.Vector.add(preferred_velocity, avoid_vector);
        if (move_vector.mag() > boid.max_speed) {
          move_vector.setMag(boid.max_speed);
        }
        boid.target_velocity = move_vector;
      }
    }
  },

  velocityObstacle: {
    name: "velocity obstacle",
    run: (boid, boids) => {
      let debug_draw_info = {
        other_boids: [],
        sample_points: [],
      };

      let preferred_velocity = p5.Vector.sub(boid.goal, boid.position);
      let preferred_mag = preferred_velocity.mag();
      if (preferred_mag > boid.max_speed) {
        preferred_velocity.setMag(boid.max_speed);
      } else {
        preferred_velocity.setMag(boid.max_speed * pow(preferred_mag / boid.max_speed, 2));
      }

      let velocity_obstacles = [];
      for (const other_boid of boids) {
        if (other_boid == boid) continue;

        let velocity_obstacle = new VelocityObstacle(boid, other_boid, boid.check_collisions_in_time);
        velocity_obstacles.push(velocity_obstacle);

        debug_draw_info.other_boids.push({
          other_boid: other_boid,
          velocity_obstacle: velocity_obstacle,
        });
      }

      boid.target_velocity = findBestSampleVelocity(preferred_velocity, velocity_obstacles, boid, debug_draw_info);

      // draw preferred and selected velocity
      debug_draw_info.preferred_velocity = preferred_velocity;
      debug_draw_info.target_velocity = boid.target_velocity;

      boid.debug_draw = debug_draw_info;
    }
  }
};

// Helper function for velocity sampling (refactored from velocityObstacle)
function findBestSampleVelocity(preferred_velocity, velocity_obstacles, boid, debug_draw_info) {
  let best_sample_velocity = createVector();
  let lowest_sample_penalty = Infinity;

  for (let sample_point_index = 0; sample_point_index < boid.viewing_resolution; sample_point_index++) {
    let sample_velocity = calculateSampleVelocity(sample_point_index, boid);

    let sample_velocity_penalty = calculatePenaltyForSampleVelocity(
      sample_velocity, preferred_velocity, velocity_obstacles, boid
    );

    if (sample_velocity_penalty < lowest_sample_penalty) {
      best_sample_velocity = sample_velocity;
      lowest_sample_penalty = sample_velocity_penalty;
    }

    debug_draw_info.sample_points.push({
      velocity: sample_velocity,
      penalty: sample_velocity_penalty
    });
  }

  return best_sample_velocity;
}

// Utility function to calculate a sample velocity based on index and max speed
function calculateSampleVelocity(sample_point_index, boid) {
  let sample_angle = sample_point_index * goldenRatio * TWO_PI;
  let sample_magnitude = sqrt(sample_point_index / boid.viewing_resolution) * boid.max_speed;
  return p5.Vector.fromAngle(sample_angle).mult(sample_magnitude);
}

// Utility function to calculate penalty for a given sample velocity
function calculatePenaltyForSampleVelocity(sample_velocity, preferred_velocity, velocity_obstacles, boid) {
  let alignment_penalty = p5.Vector.dist(sample_velocity, preferred_velocity);

  let time_to_collision_penalty = 0;
  let closest_time_to_collision = Infinity;

  for (const velocity_obstacle of velocity_obstacles) {
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

  return time_to_collision_penalty + alignment_penalty;
}

