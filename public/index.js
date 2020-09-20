"use strict";

import './js/components/customSlider.js';
import './js/components/customScore.js';
import Game from './js/game.js';

window.onload = () => {
  const playGameBtn = document.getElementById('playGameBtn');
  const game = new Game();
  playGameBtn.addEventListener('click', game.start, false);
}
