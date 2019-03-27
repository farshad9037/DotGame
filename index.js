"use strict";

const CONFIG = {
  minDotDiameter: 10, // Minimum diameter of the dot in px
  maxDotDiameter: 100, // Maximun diameter of the dot in px
  initLevel: 3, // Game level (speed = (5 * 10)px/s)
  frequency: 1000, // Frequency to push dot in ms (1000ms = 1s)
  maxLostCount: 10, // Count of maximum lost dot for game over
  colors: { // Configure dot colors {radius: color}
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
};

class Game {
  constructor() {
    this.isPlaying = false; // Whether game is on or pause/off 
    this.dots = []; // List of all dots
    this.clickedPos = { x: 0, y: 0 }; // Co-ordinates of clicked position
    this.score = 0; // Total score
    this.lostDotsCount = 0; // count of lost dots
    this.dotsInterval = null;
  }

  init() {
    this.setCanvasSize();
    this.bindResize();
    this.setSliderValue(CONFIG.initLevel);
  }

  setCanvasSize() { // Set the dimensions of canvas
    canvas.width = window.innerWidth;
    canvas.height = window.outerHeight;
  }

  bindResize() {
    window.addEventListener('resize', this.setCanvasSize, false); // Recalculate canvas size on browser resize (responsive support)
  }

  setSliderValue(value) {
    slider.value = value;
    levelEl.innerHTML = value;
  }

  bindMousedown() {
    canvas.addEventListener('mousedown', () => {
      this.setClickedPos(event.clientX, event.clientY);
    }, false);
  }

  bindSliderEvent() { // Slider event to control the speed of the game
    slider.oninput = () => this.setSliderValue(slider.value)
  }

  handleGameStatus() {
    if (this.isPlaying) {
      pauseImage.src = 'https://cdn.glitch.com/27f1b8ee-3948-4cb4-9c64-3854da42f337%2Fpause.svg?1553448788762';
      pauseLabel.innerHTML = 'pause';
    } else {
      pauseImage.src = 'https://cdn.glitch.com/27f1b8ee-3948-4cb4-9c64-3854da42f337%2Fplay.svg?1553448787217';
      pauseLabel.innerHTML = 'play';
    }
  }

  bindBlur() { // Pause the game once out of focus
    window.addEventListener('blur', () => {
      this.isPlaying = false;
      this.handleGameStatus();
    }, false);
  }

  setClickedPos(x, y) {
    this.clickedPos = { x, y };
  }

  restart() {
    if (!this.isPlaying) { // If game is paused restart the animation
      this.controlAnimation();
    }
    this.dots = [];
    this.score = 0;
    this.lostDotsCount = 0;
    scoreEl.innerHTML = 0;
    this.setSliderValue(CONFIG.initLevel);
  }

  controlAnimation() {
    this.isPlaying = !this.isPlaying; // Toggle game status
    this.setClickedPos(0, 0);
    this.handleGameStatus();
    animate(); // Handle animations based on game status
  }

  pushDotPerSec() { // Push dot every second
    this.dotsInterval = setInterval(() => {
      console.log('new');
      if (this.isPlaying) { // Check whether game is on before adding new dot
        this.dots.push(new Dot());
      }
    }, CONFIG.frequency);
  }

  start() {
    this.isPlaying = true;
    coverEl.style.display = 'none';
    headerEl.style.display = 'flex';
    this.bindMousedown();
    this.bindSliderEvent();
    this.bindBlur();
    this.handleGameStatus();
    this.dots.push(new Dot());
    this.pushDotPerSec();
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
      // requestAnimationFrame repaint every 1/60 seconds. So (y += slider.value / 60 * <10 ~ 100>) adds (10 ~ 100) every second
      dot.y += slider.value / 6;

      if (curX > dotX - radius && curX < dotX + radius && curY > dotY - radius && curY < dotY + radius) { // Logic to find clicked dot
        dot.radius = 0; // Hide clicked dot
        this.score += dot.points; // Increment score
        scoreEl.innerHTML = this.score;
        dot.isClicked = true;
      }

      if (dotY > window.outerHeight + CONFIG.maxDotDiameter) {
        if (!dot.isClicked) {
          this.lostDotsCount += 1;
          if (this.lostDotsCount === CONFIG.maxLostCount) {
            this.gameOver();
          }
        }
        this.dots.splice(index, 1);
      }
    });
  }

  gameOver() {
    this.isPlaying = false;
    clearInterval(this.dotsInterval);
    headerEl.style.display = 'none';
    gameOverEl.style.display = 'flex';
    gameOverScoreEl.innerHTML = this.score;
    canvas.removeEventListener('mousedown', () => {
      this.setClickedPos(event.clientX, event.clientY);
    }, false);
  }
};

class Dot {
  constructor() {
    this.radius = this.getRandomdInteger(1, 10) * CONFIG.minDotDiameter / 2; // Random radius between 10 and 100
    this.color = CONFIG.colors[this.radius * 2];
    // Random X co-ordinate of the dot ranges from 100 to (canvas width - 100)
    this.x = this.getRandomdInteger(CONFIG.maxDotDiameter / 2, window.outerWidth - CONFIG.maxDotDiameter / 2);
    this.y = -this.radius; // Initial Y co-ordinate of the dot
    this.points = (CONFIG.maxDotDiameter - this.radius * 2) / 10 + 1; // Points inversely proportional to radius
    this.isClicked = false;
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
};

const game = new Game();
const headerEl = document.getElementById('header');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById('score');
const slider = document.getElementById("levelSlider");
const levelEl = document.getElementById("level");
const pauseImage = document.getElementById("pause");
const pauseLabel = document.getElementById("pauseLabel");
const coverEl = document.getElementById('cover');
const gameOverEl = document.getElementById('gameOver');
const gameOverScoreEl = document.getElementById('gameOverScore');

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

