function setup() {
  createCanvas(300, 100);
  frameRate(30);
  createLoop({ duration: 10, gif: true })

}

let data_points = [];
let smoothed_points = [];

function draw() {
  background(255);

  let real_signal = 1;
  if (frameCount > width / 3) {
    real_signal = 0;
  }
  let current_signal = 1;

  if (frameCount % 2 == 0) {
    data_points.push(createVector(frameCount, real_signal));
    if (smoothed_points.length == 0) {
      smoothed_points[0] = data_points[0];
    } else {
      // smoothed_points.push(createVector(frameCount, gaussian_moving_average()));
      // smoothed_points.push(createVector(frameCount, exponential_smoothing()));
      // smoothed_points.push(createVector(frameCount, simple_moving_average()));
      smoothed_points.push(createVector(frameCount, damped_spring()));
    }
  }

  for (let i = 0; i < data_points.length; i++) {
    stroke(0);
    strokeWeight(2);
    point(data_points[i].x, (data_points[i].y * height) / 2 + height / 4);

    strokeWeight(2);
    stroke(10, 10, 255);
    point(smoothed_points[i].x, (smoothed_points[i].y * height) / 2 + height / 4);
  }
}

function simple_moving_average() {
  let window_length = 40;

  let sum = 0;
  let k = min(data_points.length, window_length);
  for (let i = 0; i < k; i++) {
    sum += data_points[data_points.length - i - 1].y / k;
  }
  return sum;
}

function gaussian_moving_average() {
  let window_length = 40;
  let sigma = window_length / 6; // Adjust sigma relative to the window length

  let sum = 0;
  let weight_sum = 0;
  let k = Math.min(data_points.length, window_length);

  for (let i = 0; i < k; i++) {
    let weight = Math.exp(-Math.pow(i - k / 2, 2) / (2 * Math.pow(sigma, 2)));
    sum += data_points[data_points.length - i - 1].y * weight;
    weight_sum += weight;
  }

  return sum / weight_sum; // Normalize by the sum of the weights
}

function exponential_smoothing() {
  let a = 0.9;

  return (
    data_points[data_points.length - 1].y * (1 - a) +
    smoothed_points[smoothed_points.length - 1].y * a
  ); // Normalize by the sum of the weights
}

let spring_vel = 0;
let dt = 0.1;
function damped_spring() {
  let k = 1;

  let d = 2 * sqrt(k);

  let dsv = -d * spring_vel - k * (smoothed_points[smoothed_points.length - 1].y - data_points[data_points.length - 1].y);

  spring_vel += dsv * dt;
  return smoothed_points[smoothed_points.length - 1].y + spring_vel * dt;

}