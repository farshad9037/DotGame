"use strict";

const CONFIG = {
  minDotDiameter: 10, // Minimum diameter of the dot in px
  maxDotDiameter: 100, // Maximun diameter of the dot in px
  initSpeed: 50, // Game speed in px per second (speed = (5 * 10)px)
  frequency: 1000, // Frequency to push dot in ms (1000ms = 1s)
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
    this.isPlaying = false; // Whether game is on or pause/off 
    this.dots = []; // List of all dots
    this.clickedPos = { x: 0, y: 0 }; // Co-ordinates of clicked position
    this.score = 0; // Total score
    this.speed = CONFIG.initSpeed;
  }

  init() {
    speedEl.innerHTML = CONFIG.initSpeed;
    slider.value = this.speed / 10;
    this.setCanvasSize();
    this.bindResize();
    this.bindSliderEvent();
    this.bindBlur();
  }

  setCanvasSize() { // Set the dimensions of canvas
    canvas.width = window.outerWidth;
    canvas.height = window.outerHeight;
  }

  bindResize() {
    window.addEventListener('resize', () => this.setCanvasSize(), false); // Recalculate canvas size on browser resize (responsive support)
  }

  bindMousedown() {
    canvas.addEventListener('mousedown', () => { // TODO: bind touch event for mobile devices
      this.setClickedPos(event.clientX, event.clientY);
    }, false);
  }

  handleGameStatus() {
    const status = this.isPlaying ? 'pause' : 'play';

    pauseImage.src = `${status}.svg`;
    pauseLabel.innerHTML = status;
  }

  bindSliderEvent() { // Slider event to control the speed of the game
    slider.oninput = () => {
      this.speed = slider.value * 10;
      speedEl.innerHTML = this.speed;
    }
  }

  bindBlur() { // Pause the game once out of focus
    window.addEventListener('blur', () => {
      this.isPlaying = false;
      this.handleGameStatus();
    }, false)
  }

  handleDotClick(dot, index, curX, curY) {
    const dotX = dot.x;
    const dotY = dot.y;
    const radius = dot.radius;

    if (curX > dotX - radius && curX < dotX + radius && curY > dotY - radius && curY < dotY + radius) { // Logic to find clicked dot
      dot.radius = 0; // Hide clicked dot
      this.score += dot.points; // Increment score
      scoreEl.innerHTML = this.score;
    }

    if (dotY > canvas.height + CONFIG.maxDotDiameter) {
      this.dots.splice(index, 1);
    }
  }

  setClickedPos(x, y) {
    this.clickedPos = { x, y };
  }

  restart() {
    this.dots = [];
    this.score = 0;
    scoreEl.innerHTML = 0;
    slider.value = CONFIG.initSpeed / 10;
    this.speed = CONFIG.initSpeed;
    speedEl.innerHTML = CONFIG.initSpeed;
  }

  controlAnimation() {
    this.isPlaying = !game.isPlaying; // Toggle game status
    this.setClickedPos(0, 0);
    this.handleGameStatus();
    animate(); // Handle animations based on game status
  }

  pushDot = () => {
    if (this.isPlaying) { // Check whether game is on before adding new dot
      this.dots.push(new Dot());
    }
    setTimeout(this.pushDot, CONFIG.frequency);
  };

  start() {
    this.bindMousedown();
    startBtnEl.style.display = 'none';
    this.isPlaying = true;
    this.handleGameStatus();
    this.pushDot(); // Push dot every second
  }

  updateDots() {
    const currentClick = JSON.parse(JSON.stringify(game.clickedPos));
    const curX = currentClick.x;
    const curY = currentClick.y;

    this.setClickedPos(0, 0);// Reset clicked coordinates. Otherwise future dots of same coordinates will be considered as clicked
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.dots.forEach((dot, index) => {
      const dotX = dot.x;
      const dotY = dot.y;
      const radius = dot.radius;

      dot.update();

      // Speed range is 10px ~ 100px per second based on the configuration.
      // requestAnimationFrame repaint every 1/60 seconds. So (y += speed / 60 * <10 ~ 100>) adds (10 ~ 100) every second
      dot.y += game.speed / 60;

      if (curX > dotX - radius && curX < dotX + radius && curY > dotY - radius && curY < dotY + radius) { // Logic to find clicked dot
        dot.radius = 0; // Hide clicked dot
        this.score += dot.points; // Increment score
        scoreEl.innerHTML = this.score;
      }

      if (dotY > canvas.height + CONFIG.maxDotDiameter) {
        this.dots.splice(index, 1);
      }
    });
  }
}

class Dot {
  constructor() {
    this.radius = this.getRandomdInteger(1, 10) * CONFIG.minDotDiameter / 2; // Random radius between 10 and 100
    this.color = CONFIG.colors[this.radius * 2];
    // Random X co-ordinate of the dot ranges from 100 to (canvas width - 100)
    this.x = this.getRandomdInteger(CONFIG.maxDotDiameter / 2, window.outerWidth - CONFIG.maxDotDiameter / 2);
    this.y = -this.radius; // Initial Y co-ordinate of the dot
    this.points = (CONFIG.maxDotDiameter - this.radius * 2) / 10 + 1; // Points inversely proportional to radius
  }

  update() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  getRandomdInteger(min, max) { // Utility method to find random numbers
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const game = new Game();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById('score');
const slider = document.getElementById("speedSlider");
const speedEl = document.getElementById("speed");
const pauseImage = document.getElementById("pause");
const pauseLabel = document.getElementById("pauseLabel");
const startBtnEl = document.getElementById('startBtn')

game.init();

function start() {
  game.start();
  animate();
}

function animate() {
  if (!game.isPlaying) {
    cancelAnimationFrame(animate); // Pause the game
    return;
  }

  requestAnimationFrame(animate); // Continue animation if game is on.
  game.updateDots();
}

function controlAnimation() {
  game.controlAnimation();
}

function restart() {
  game.restart();
}



