"use strict";

const MIN_DOT_DIAMETER = 10;
const MAX_DOT_DIAMETER = 100;
const winX = window.outerWidth;
const winY = window.outerHeight;
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
let dotArr = [];
let isPlay = false;
let mouseX = 0;
let mouseY = 0;
let score = 0;

canvas.width = winX;
canvas.height = winY;

class Dot {
  constructor() {
    this.color = 'blue';
    this.radius = getRndInteger(1, 10) * MIN_DOT_DIAMETER / 2;
    this.x = getRndInteger(MAX_DOT_DIAMETER, winX - MAX_DOT_DIAMETER); // returns a random integer between 100 and (winX - 100)
    this.y = -this.radius;
    this.points = (MAX_DOT_DIAMETER - this.radius * 2) / 10 + 1; // Points inversely proportional to radius
  }

  update() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
  }
}

function start() {
  document.getElementById('startBtn').style.display = 'none';
  isPlay = true;
  dotArr.push(new Dot())
  animate();

  // Push dot every second
  setInterval(function () {
    if (isPlay) {
      dotArr.push(new Dot());
    }
  }, 1000);
}

window.addEventListener("click", function () {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function animate() {
  if (!isPlay) {
    cancelAnimationFrame(animate); // Cancel animation on game pause 
    return;
  }

  requestAnimationFrame(animate); // Continue animation if game is on.
  c.clearRect(0, 0, winX, winY);
  dotArr.forEach(each => {
    each.update();
    // Speed range is 10px ~ 100px per second based on the configuration.
    // requestAnimationFrame repaint every 1/60 seconds. So (y += 1 / 60 * <10 ~ 100>) adds (10 ~ 100) every second
    each.y += 1 / 6;

    // Logic to find clicked dot
    if (mouseX > each.x - each.radius &&
      mouseX < each.x + each.radius &&
      mouseY > each.y - each.radius &&
      mouseY < each.y + each.radius) {

      each.radius = 0; // Hide clicked dot
      score += each.points; // Increment score
      document.getElementById('score').innerHTML = score;

      // Reset clicked coordinates. Otherwise future dots of same coordinates will be considered as clicked
      mouseX = 0;
      mouseY = 0;
    }
  });
}

function controlAnimation() {
  isPlay = !isPlay; // Toggle game status
  animate(); // Handle animations based on game status
}

// Utility method to find random numbers
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

