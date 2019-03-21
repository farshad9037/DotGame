"use strict";

const MIN_DOT_DIAMETER = 10;
const MAX_DOT_DIAMETER = 100;

class Utils {
  constructor() {
    this.isPlaying = false;
    this.dotArr = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.score = 0;
    this.canvas = document.getElementById("canvas");
    this.c = this.canvas.getContext("2d");
    this.setCanvasSize();
    this.bindResize();
  }

  // Utility method to find random numbers
  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  setCanvasSize() {
    this.canvas.width = window.outerWidth;
    this.canvas.height = window.outerHeight;
  }

  bindResize() {
    window.addEventListener('resize', function () {
      utils.setCanvasSize();
    }, false);
  }
}

const utils = new Utils();

class Dot {
  constructor() {
    this.color = 'blue';
    this.radius = utils.getRndInteger(1, 10) * MIN_DOT_DIAMETER / 2;
    this.x = utils.getRndInteger(MAX_DOT_DIAMETER, utils.canvas.width - MAX_DOT_DIAMETER); // returns a random integer between 100 and (canvas width - 100)
    this.y = -this.radius;
    this.points = (MAX_DOT_DIAMETER - this.radius * 2) / 10 + 1; // Points inversely proportional to radius
    
  }

  update() {
    utils.c.beginPath();
    utils.c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    utils.c.fillStyle = this.color;
    utils.c.fill();
  }
}

function start() {
  document.getElementById('startBtn').style.display = 'none';
  utils.isPlaying = true;
  utils.dotArr.push(new Dot())
  animate();

  // Push dot every second
  setInterval(function () {
    if (utils.isPlaying) {
      utils.dotArr.push(new Dot());
    }
  }, 1000);

  window.addEventListener('click', function () {
    utils.mouseX = event.clientX;
    utils.mouseY = event.clientY;
  }, false);
}

function animate() {
  if (!utils.isPlaying) {
    cancelAnimationFrame(animate); // Cancel animation on game pause 
    return;
  }

  requestAnimationFrame(animate); // Continue animation if game is on.
  utils.c.clearRect(0, 0, utils.canvas.width, utils.canvas.height);
  utils.dotArr.forEach(each => {
    each.update();
    // Speed range is 10px ~ 100px per second based on the configuration.
    // requestAnimationFrame repaint every 1/60 seconds. So (y += 1 / 60 * <10 ~ 100>) adds (10 ~ 100) every second
    each.y += 5 / 6;

    // Logic to find clicked dot
    if (utils.mouseX > each.x - each.radius &&
      utils.mouseX < each.x + each.radius &&
      utils.mouseY > each.y - each.radius &&
      utils.mouseY < each.y + each.radius) {

      each.radius = 0; // Hide clicked dot
      utils.score += each.points; // Increment score
      document.getElementById('score').innerHTML = utils.score;

      // Reset clicked coordinates. Otherwise future dots of same coordinates will be considered as clicked
      utils.mouseX = 0;
      utils.mouseY = 0;
    }
  });
}

function controlAnimation() {
  utils.isPlaying = !utils.isPlaying; // Toggle game status
  animate(); // Handle animations based on game status
}





