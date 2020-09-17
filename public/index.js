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
const play = document.getElementById("play");
const pause = document.getElementById("pause");
const coverEl = document.getElementById('gameCover');
const gameOverEl = document.getElementById('gameOver');
const gameOverScoreEl = document.getElementById('gameOverScore');
const playGameBtn = document.getElementById('playGameBtn');
const water = document.getElementById('water');

let dots = [new Dot()];
let dotsInterval = null;
let animateReq;

const setSliderValue = (value) => {
  slider.value = value;
  levelEl.innerHTML = value;
};

const handleGameStatus = () => {
  if (game.isPlaying) {
    play.style.display = 'none';
    pause.style.display = 'flex';
  } else {
    play.style.display = 'flex';
    pause.style.display = 'none';
  }
}

const onBlur = () => {
  game.isPlaying = false;
  handleGameStatus();
};

const controlAnimation = () => {
  game.isPlaying = !game.isPlaying;
  canvas.clickedPos = { x: 0, y: 0 }
  handleGameStatus();
  animate();
}

const start = () => {
  canvas.create();
  game.isPlaying = true;
  // water.style.top = `${canvas.height}px`;
  handleGameStatus();
  coverEl.style.display = 'none';
  headerEl.style.display = 'flex';
  setSliderValue(CONFIG.initLevel);
  pushDotPerSec();
  animateReq = requestAnimationFrame(animate);
  slider.oninput = () => setSliderValue(slider.value)
  window.addEventListener('blur', onBlur, false);
  play.addEventListener('click', controlAnimation, false);
  pause.addEventListener('click', controlAnimation, false);
}
playGameBtn.addEventListener('click', start, false);

const gameOver = () => {
  game.isPlaying = false;
  clearInterval(dotsInterval);
  headerEl.style.display = 'none';
  gameOverEl.style.display = 'flex';
  gameOverScoreEl.innerHTML = game.score;
  window.removeEventListener('blur', onBlur, false);
  play.removeEventListener('click', controlAnimation, false);
  pause.removeEventListener('click', controlAnimation, false);
  canvas.$destroy();
}

// Push dot every second
const pushDotPerSec = () => {
  dotsInterval = setInterval(() => {
    // Check whether game is on before adding new dot
    if (game.isPlaying) {
      dots.push(new Dot());
    }
  }, CONFIG.frequency);
}

function animate() {
  const { x: curX, y: curY } = canvas.clickedPos;
  canvas.$clearRect();

  dots.forEach((dot, index) => {
    canvas.$draw(dot);
    dot.$updateY(slider.value);
    water.style.height = `${parseFloat(water.style.height || '0', 10) + (1 / 60)}px`;

    if (curY > 0 && dot.$isClickOnDot(curX, curY)) {
      dot.$pop();
      game.score += dot.points;
      scoreEl.innerHTML = game.score;
      dot.isClicked = true;
    }

    if (dot.$isOutOfScreen(canvas.height)) {
      dots.splice(index, 1);
    }
  });

  if (parseFloat(water.style.height) >= canvas.height) {
    gameOver();
  }

  if (!game.isPlaying) {
    cancelAnimationFrame(animateReq);
    return;
  }
  animateReq = requestAnimationFrame(animate);
}

