"use strict";


import CONFIG from './js/config.js';
import Canvas from './js/canvas.js';
import Game from './js/game.js';
import Dot from './js/dot.js';

const game = new Game();
const canvas = new Canvas();
const dots = [];

const headerEl = document.getElementById('gameHeader');
const scoreEl = document.getElementById('gameScore');
const slider = document.getElementById("gameLevelSlider");
const levelEl = document.getElementById("gameLevel");
const pauseImage = document.getElementById("gamePause");
const pauseLabel = document.getElementById("gamePauseLabel");
const coverEl = document.getElementById('gameCover');
const gameOverEl = document.getElementById('gameOver');
const gameOverScoreEl = document.getElementById('gameOverScore');
const playGameBtn = document.getElementById('playGameBtn');
const gameControl = document.getElementById('gameControl');
const restartIcon = document.getElementById('restartIcon');

let dotsInterval = null;

function setSliderValue(value) {
  slider.value = value;
  levelEl.innerHTML = value;
}

function bindSliderEvent() { // Slider event to control the speed of the game
  slider.oninput = () => setSliderValue(slider.value)
}

function handleGameStatus() {
  if (game.getIsPlaying()) {
    pauseImage.src = 'https://cdn.glitch.com/27f1b8ee-3948-4cb4-9c64-3854da42f337%2Fpause.svg?1553448788762';
    pauseLabel.innerHTML = 'pause';
  } else {
    pauseImage.src = 'https://cdn.glitch.com/27f1b8ee-3948-4cb4-9c64-3854da42f337%2Fplay.svg?1553448787217';
    pauseLabel.innerHTML = 'play';
  }
}

function controlAnimation() {
  game.setIsPlaying(!game.getIsPlaying()); // Toggle game status
  canvas.setClickedPos(0, 0);
  handleGameStatus();
  animate(); // Handle animations based on game status
}

function restart() {
  if (!game.isPlaying) { // If game is paused restart the animation
    controlAnimation();
  }
  dots = [];
  game.score = 0;
  game.lostDotsCount = 0;
  scoreEl.innerHTML = 0;
  setSliderValue(CONFIG.initLevel);
}

function updateDots() {
  try {
    const currentClick = JSON.parse(JSON.stringify(canvas.getClickedPos()));
    const { x: curX, y: curY } = currentClick;

    canvas.setClickedPos(0, 0);// Reset clicked coordinates. Otherwise future dots of same coordinates will be considered as clicked
    canvas.clearRect();

    dots.forEach((dot, index) => {
      const { x: dotX, y: dotY, radius } = dot;

      canvas.update(dot);

      // Speed range is 10px ~ 100px per second based on the configuration.
      // requestAnimationFrame repaint every 1/60 seconds. So (y += slider.value / 60 * <10 ~ 100>) adds (10 ~ 100) every second
      dot.y += slider.value / 6;

      if (curX > dotX - radius && curX < dotX + radius && curY > dotY - radius && curY < dotY + radius) { // Logic to find clicked dot
        dot.radius = 0; // Hide clicked dot
        game.score += dot.points; // Increment score
        handleGameLevel();
        scoreEl.innerHTML = game.score;
        dot.isClicked = true;
      }

      if (dotY > window.outerHeight + CONFIG.maxDotDiameter) {
        if (!dot.isClicked) {
          game.lostDotsCount += 1;
          if (game.lostDotsCount === CONFIG.maxLostCount) {
            gameOver();
          }
        }
        dots.splice(index, 1);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function pushDotPerSec() { // Push dot every second
  dotsInterval = setInterval(() => {
    if (game.isPlaying) { // Check whether game is on before adding new dot
      dots.push(new Dot());
    }
  }, CONFIG.frequency);
}

function start() {
  canvas.create();
  game.isPlaying = true;
  coverEl.style.display = 'none';
  headerEl.style.display = 'flex';
  setSliderValue(CONFIG.initLevel);
  dots.push(new Dot());
  pushDotPerSec();
  animate();
  bindSliderEvent();

  // Recalculate canvas size on browser resize (responsive support)
  window.addEventListener('resize', () => {
    canvas.setSize();
  }, false);

  window.addEventListener('blur', () => {
    game.setIsPlaying(false);
    handleGameStatus();
  }, false);

  gameControl.addEventListener('click', controlAnimation, false);
  restartIcon.addEventListener('click', restart, false);
}

playGameBtn.addEventListener('click', start, false);

function animate() {
  if (!game.isPlaying) {
    cancelAnimationFrame(animate); // Pause the game
    return;
  }

  requestAnimationFrame(animate); // Continue animation if game is on.
  updateDots();
}

window.addEventListener('blur', () => {
  // Pause the game once out of focus
  game.setIsPlaying(false);
  handleGameStatus();
}, false);

function gameOver() {
  game.setIsPlaying(false);
  clearInterval(dotsInterval);
  headerEl.style.display = 'none';
  gameOverEl.style.display = 'flex';
  gameOverScoreEl.innerHTML = game.score;
  canvas.removeEventListener('mousedown', () => {
    canvas.setClickedPos(event.clientX, event.clientY);
  }, false);
}

function handleGameLevel() {
  const currLevel = parseInt(slider.value);

  if (currLevel < 10 && (game.score / CONFIG.gameLevelFreq) > currLevel) {
    setSliderValue(currLevel + 1);
  }
}