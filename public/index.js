"use strict";

import './js/components/customSlider.js';
import './js/components/customScore.js';

import CONFIG from './js/config.js';
import Canvas from './js/canvas.js';

const canvas = new Canvas();
const headerEl = document.getElementById('gameHeader');
const customScore = document.getElementById('customScore');
const customSlider = document.getElementById("customSlider");
const play = document.getElementById("play");
const pause = document.getElementById("pause");
const coverEl = document.getElementById('gameCover');
const gameOverEl = document.getElementById('gameOver');
const gameOverScoreEl = document.getElementById('gameOverScore');
const playGameBtn = document.getElementById('playGameBtn');
const water = document.getElementById('water');

let animateReq;

const handleGameStatus = () => {
  if (canvas.isAnimate) {
    play.style.display = 'none';
    pause.style.display = 'flex';
  } else {
    play.style.display = 'flex';
    pause.style.display = 'none';
  }
}

const onBlur = () => {
  canvas.isAnimate = false;
  handleGameStatus();
};

const controlAnimation = () => {
  canvas.isAnimate = !canvas.isAnimate;
  canvas.clickedPos = { x: 0, y: 0 }
  handleGameStatus();
  animate();
}

const start = () => {
  canvas.create();
  canvas.isAnimate = true;
  handleGameStatus();
  coverEl.style.display = 'none';
  headerEl.style.display = 'flex';
  customSlider.value = CONFIG.initLevel;
  canvas.pushDotPerSec(CONFIG.frequency);
  animateReq = requestAnimationFrame(animate);
  window.addEventListener('blur', onBlur, false);
  play.addEventListener('click', controlAnimation, false);
  pause.addEventListener('click', controlAnimation, false);
}

const gameOver = () => {
  canvas.isAnimate = false;
  headerEl.style.display = 'none';
  gameOverEl.style.display = 'flex';
  gameOverScoreEl.innerHTML = customScore.innerText;
  window.removeEventListener('blur', onBlur, false);
  play.removeEventListener('click', controlAnimation, false);
  pause.removeEventListener('click', controlAnimation, false);
  canvas.$destroy();
}

function animate() {
  const { x: curX, y: curY } = canvas.clickedPos;
  canvas.$clearRect();

  canvas.dots.forEach((dot, index) => {
    canvas.$draw(dot);
    dot.$updateY(customSlider.value);
    water.style.height = `${parseFloat(water.style.height || '0', 10) + (1 / 60)}px`;

    if (curY > 0 && dot.$isClickOnDot(curX, curY)) {
      dot.$pop();
      customScore.value += dot.points;
      dot.isClicked = true;
    }

    if (dot.$isOutOfScreen(canvas.height)) {
      canvas.$removeDot(index);
    }
  });

  if (parseFloat(water.style.height) >= canvas.height) {
    gameOver();
  }

  if (!canvas.isAnimate) {
    cancelAnimationFrame(animateReq);
    return;
  }
  animateReq = requestAnimationFrame(animate);
}

window.onload = () => {
  playGameBtn.addEventListener('click', start, false);
}
