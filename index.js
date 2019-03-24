"use strict";

const CONFIG = {
  // Minimum diameter of the dot in px
  minDotDiameter: 10,
  // Maximun diameter of the dot in px
  maxDotDiameter: 100,
  // Game speed in px per second (speed = (5 * 10)px)
  initSpeed: 50,
  // Frequency to push dot in ms (1000ms = 1s)
  frequency: 1000,
  colors: {
    10: 'rgba(255, 255, 255, 1)',
    20: 'rgba(255, 0, 0, 0.9)',
    30: 'rgba(255, 0, 255, 0.8)',
    40: 'rgba(0, 128, 0, 0.7)',
    50: 'rgba(255, 255, 255, 0.6)',
    60: 'rgba(205, 92, 92, 0.5)',
    70: 'rgba(128, 0, 0, 0.4)',
    80: 'rgba(47, 79, 79, 0.4)',
    90: 'rgba(75, 0 , 130, 0.4)',
    100: 'rgba(255, 255, 255, 0.3)',
  }
}

class Game {
  constructor() {
    // Whether game is on or pause/off 
    this.isPlaying = false;
    // List of all dots
    this.dots = [];
    // Co-ordinates of clicked position
    this.clickedPos = { x: 0, y: 0 };
    // Total score
    this.score = 0;
    this.speed = CONFIG.initSpeed;
    this.scoreElement = document.getElementById('score');
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.slider = document.getElementById("speedSlider");
    this.speedElement = document.getElementById("speed");
    this.speedElement.innerHTML = this.speed;
    this.pauseImage = document.getElementById("pause");
    this.pauseLabel = document.getElementById("pauseLabel")
    this.slider.value = this.speed / 10;
    this.setCanvasSize();
    this.bindResize();
    this.bindSlider();
    // this.bindBlur();
  }

  // Utility method to find random numbers
  getRandomdInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Set the dimensions of canvas
  setCanvasSize() {
    this.canvas.width = window.outerWidth;
    this.canvas.height = window.outerHeight;
  }

  bindResize() {
    // Recalculate the canvas dimensions on browser resize (responsive support)
    window.addEventListener('resize', () => this.setCanvasSize());
  }

  // Slider event to control the speed of the game
  bindSlider() {
    this.slider.oninput = () => {
      this.speed = this.slider.value * 10;
      this.speedElement.innerHTML = this.speed;
    }
  }

  bindBlur() {
    // Pause the game once out of focus
    window.addEventListener('blur', () => this.isPlaying = false)
  }

  handleDotClick(dot, index, currentClick) {
    // Logic to find clicked dot
    if (currentClick.x > dot.x - dot.radius &&
      currentClick.x < dot.x + dot.radius &&
      currentClick.y > dot.y - dot.radius &&
      currentClick.y < dot.y + dot.radius) {

      // Hide clicked dot
      dot.radius = 0;
      // Increment score
      this.score += dot.points;
      this.scoreElement.innerHTML = this.score;
    }

    if (dot.y > window.outerHeight + CONFIG.maxDotDiameter) {
      this.dots.splice(index, 1);
    }
  }
}

// Create new instance of Game
const game = new Game();

class Dot {
  constructor() {
    this.radius = game.getRandomdInteger(1, 10) * CONFIG.minDotDiameter / 2;
    this.color = CONFIG.colors[this.radius * 2];
    // Random X co-ordinate of the dot ranges from 100 to (canvas width - 100)
    this.x = game.getRandomdInteger(CONFIG.maxDotDiameter / 2, game.canvas.width - CONFIG.maxDotDiameter / 2);
    // Initial Y co-ordinate of the dot
    this.y = -this.radius;
    // Points inversely proportional to radius
    this.points = (CONFIG.maxDotDiameter - this.radius * 2) / 10 + 1;
  }

  update() {
    game.ctx.beginPath();
    game.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    game.ctx.fillStyle = this.color;
    game.ctx.fill();
  }
}

function start() {
  const pushDot = () => {
    // Check whether game is on before adding new dot
    if (game.isPlaying) {
      game.dots.push(new Dot());
    }
    setTimeout(pushDot, CONFIG.frequency);
  };

  document.getElementById('startBtn').style.display = 'none';
  game.isPlaying = true;
  game.pauseImage.src = 'pause.svg';
  game.dots.push(new Dot())
  animate();

  // Push dot every second
  setTimeout(pushDot, CONFIG.frequency);

  // Need to add touch event for mobile devices
  game.canvas.addEventListener('mousedown', () => {
    game.clickedPos = { x: event.clientX, y: event.clientY };
  }, false);
}

function animate() {
  const currentClick = JSON.parse(JSON.stringify(game.clickedPos));
  // Reset clicked coordinates. Otherwise future dots of same coordinates will be considered as clicked
  game.clickedPos = { x: 0, y: 0 };

  if (!game.isPlaying) {
    // Pause the game
    cancelAnimationFrame(animate);
    return;
  }

  requestAnimationFrame(animate); // Continue animation if game is on.
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  game.dots.forEach((dot, index) => {
    dot.update();
    // Speed range is 10px ~ 100px per second based on the configuration.
    // requestAnimationFrame repaint every 1/60 seconds. So (y += speed / 60 * <10 ~ 100>) adds (10 ~ 100) every second
    dot.y += game.speed / 60;

    game.handleDotClick(dot, index, currentClick);
  });
}

function controlAnimation() {
  // Toggle game status
  game.isPlaying = !game.isPlaying;
  game.clickedPos = { x: 0, y: 0 };
  if (game.isPlaying) {
    game.pauseImage.src = 'pause.svg';
    game.pauseLabel.innerHTML = 'pause';
  } else {
    game.pauseImage.src = 'play.svg';
    game.pauseLabel.innerHTML = 'play';
  }
  animate(); // Handle animations based on game status
}

function restart() {
  game.dots = [];
  game.score = 0;
  game.scoreElement.innerHTML = 0;
  game.slider.value = CONFIG.initSpeed / 10;
  game.speed = CONFIG.initSpeed;
  game.speedElement.innerHTML = CONFIG.initSpeed;
}





