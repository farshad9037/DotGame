"use strict";

import CONFIG from './js/config.js';
import Canvas from './js/canvas.js';
import Game from './js/game.js';
import Dot from './js/dot.js';

const game = new Game();
const canvas = new Canvas();

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

const setSliderValue = (value) => {
  slider.value = value;
  levelEl.innerHTML = value;
};

const restart = () => {
  if (!game.isPlaying) { // If game is paused restart the animation
    controlAnimation();
  }
  dots = [new Dot()];
  game.score = 0;
  game.lostDotsCount = 0;
  scoreEl.innerHTML = 0;
  setSliderValue(CONFIG.initLevel);
};

const handleGameStatus = () => {
  if (game.isPlaying) {
    pauseImage.src = 'https://cdn.glitch.com/27f1b8ee-3948-4cb4-9c64-3854da42f337%2Fpause.svg?1553448788762';
    pauseLabel.innerHTML = 'pause';
  } else {
    pauseImage.src = 'https://cdn.glitch.com/27f1b8ee-3948-4cb4-9c64-3854da42f337%2Fplay.svg?1553448787217';
    pauseLabel.innerHTML = 'play';
  }
}

const onBlur = () => {
  // Pause the game once out of focus
  game.isPlaying = false;
  handleGameStatus();
};

const controlAnimation = () => {
  game.isPlaying = !game.isPlaying; // Toggle game status
  canvas.clickedPos = { x: 0, y: 0 }
  handleGameStatus();
  // Handle animations based on game status
  animate();
}

const handleGameLevel = () => {
  const currLevel = Number(slider.value);

  if (currLevel < 10 && (game.score / CONFIG.gameLevelFreq) > currLevel) {
    setSliderValue(currLevel + 1);
  }
}

const start = () => {
  canvas.create();
  game.isPlaying = true;
  coverEl.style.display = 'none';
  headerEl.style.display = 'flex';
  setSliderValue(CONFIG.initLevel);
  pushDotPerSec();
  animate();
  // Slider event to control the speed of the game
  slider.oninput = () => setSliderValue(slider.value)
  window.addEventListener('blur', onBlur, false);
  gameControl.addEventListener('click', controlAnimation, false);
  restartIcon.addEventListener('click', restart, false);
}
playGameBtn.addEventListener('click', start, false);

const gameOver = () => {
  game.isPlaying = false;
  clearInterval(dotsInterval);
  headerEl.style.display = 'none';
  gameOverEl.style.display = 'flex';
  gameOverScoreEl.innerHTML = game.score;
  canvas.$destroy();
  window.removeEventListener('blur', onBlur, false);
  gameControl.removeEventListener('click', controlAnimation, false);
  restartIcon.removeEventListener('click', restart, false);
}

// Push dot every second
const pushDotPerSec = () => {
  dotsInterval = setInterval(() => {
    if (game.isPlaying) { // Check whether game is on before adding new dot
      dots.push(new Dot());
    }
  }, CONFIG.frequency);
}

let dots = [new Dot()];
let dotsInterval = null;

function animate() {
  const updateDots = () => {
    const { x: curX, y: curY } = canvas.clickedPos;
    canvas.clearRect();
  
    dots.forEach((dot, index) => {
      canvas.update(dot);
  
      // Speed range is 10px ~ 100px per second based on the configuration.
      // requestAnimationFrame repaint every 1/60 seconds. So (y += slider.value / 60 * <10 ~ 100>) adds (10 ~ 100) every second
      dot.y += slider.value / 6;
  
      if (dot.$isClickOnDot(curX, curY)) {
        // Pop clicked dot
        dot.radius = 0;
        // Increment game score
        game.score += dot.points;
        handleGameLevel();
        scoreEl.innerHTML = game.score;
        dot.isClicked = true;
      }
  
      if (dot.$isOutOfScreen(canvas.height)) {
        if (!dot.isClicked) {
          game.lostDotsCount += 1;
          if (game.$isLost()) {
            gameOver();
          }
        }
        // Remove dot from the dots list
        dots.splice(index, 1);
      }
    });
  }

  if (!game.isPlaying) {
    cancelAnimationFrame(animate); // Pause the game
    return;
  }

  requestAnimationFrame(animate); // Continue animation if game is on.
  updateDots();
}
