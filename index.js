"use strict";

const CONFIG = {
  // Minimum diameter of the dot in px
  minDotDiameter: 10,
  // Maximun diameter of the dot in px
  maxDotDiameter: 100,
  // Game speed in px per second (speed = (5 * 10)px)
  initSpeed: 50,
  // Frequency to push dot in ms (1000ms = 1s)
  frequency: 1000
}

class Game {
  constructor() {
    // Whether game is on or pause/off 
    this.isPlaying = false;
    // List of all dots
    this.dots = [];
    // X co-ordinate of click - defaults to 0
    this.mouseX = 0;
    // Y co-ordinate of click - defaults to 0
    this.mouseY = 0;
    // Total score
    this.score = 0;
    this.canvas = document.getElementById("canvas");
    this.c = this.canvas.getContext("2d");
    // Slider element
    this.slider = document.getElementById("speedSlider");
    this.speedElement = document.getElementById("speed");
    // Current speed of the game
    this.speed = CONFIG.initSpeed;
    this.slider.value = this.speed / 10;
    this.speedElement.innerHTML = this.speed;
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

  randomColor() {
    // Random r,g,b value has been calculated
    return `rgb(${Math.round(Math.random() * 250)}, ${Math.round(Math.random() * 250)}, ${Math.round(Math.random() * 250)})`;
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

  handleDotClick(dot, index) {
    // Logic to find clicked dot
    if (this.mouseX > dot.x - dot.radius &&
      this.mouseX < dot.x + dot.radius &&
      this.mouseY > dot.y - dot.radius &&
      this.mouseY < dot.y + dot.radius) {

      dot.radius = 0; // Hide clicked dot
      this.score += dot.points; // Increment score
      document.getElementById('score').innerHTML = this.score;

      // Reset clicked coordinates. Otherwise future dots of same coordinates will be considered as clicked
      this.mouseX = 0;
      this.mouseY = 0;
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
    this.color = game.randomColor();
    this.radius = game.getRandomdInteger(1, 10) * CONFIG.minDotDiameter / 2;
    // Random X co-ordinate of the dot ranges from 100 to (canvas width - 100)
    this.x = game.getRandomdInteger(CONFIG.maxDotDiameter / 2, game.canvas.width - CONFIG.maxDotDiameter / 2);
    // Initial Y co-ordinate of the dot
    this.y = -this.radius;
    // Points inversely proportional to radius
    this.points = (CONFIG.maxDotDiameter - this.radius * 2) / 10 + 1;
  }

  update() {
    game.c.beginPath();
    game.c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    game.c.fillStyle = this.color;
    game.c.fill();
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
  const onClick = () => {
    game.mouseX = event.clientX;
    game.mouseY = event.clientY;
  };

  document.getElementById('startBtn').style.display = 'none';
  game.isPlaying = true;
  game.dots.push(new Dot())
  animate();

  // Push dot every second
  setTimeout(pushDot, CONFIG.frequency);

  game.canvas.addEventListener('click', onClick);
  game.canvas.addEventListener("touchstart", onClick);
}

function animate() {
  if (!game.isPlaying) {
    // Pause the game
    cancelAnimationFrame(animate);
    return;
  }

  requestAnimationFrame(animate); // Continue animation if game is on.
  game.c.clearRect(0, 0, game.canvas.width, game.canvas.height);
  game.dots.forEach((dot, index) => {
    dot.update();
    // Speed range is 10px ~ 100px per second based on the configuration.
    // requestAnimationFrame repaint every 1/60 seconds. So (y += speed / 60 * <10 ~ 100>) adds (10 ~ 100) every second
    dot.y += game.speed / 60;

    game.handleDotClick(dot, index);
  });
}

function controlAnimation() {
  game.isPlaying = !game.isPlaying; // Toggle game status
  animate(); // Handle animations based on game status
}





