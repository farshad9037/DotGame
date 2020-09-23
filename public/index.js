"use strict";

import Game from './js/game.js';
import CONFIG from './js/config.js';

window.onload = () => {
  const playGameBtn = document.getElementById('playGameBtn');
  const game = new Game({
    minDotDiameter: CONFIG.minDotDiameter,
    maxDotDiameter: CONFIG.maxDotDiameter,
    dotFrequency: CONFIG.frequency,
    colors: CONFIG.colors,
    playId: 'play',
    pauseId: 'pause',
    coverId: 'gameCover',
    headerId: 'gameInfo',
    gameOverId: 'gameOver',
    gameOverScoreId: 'gameOverScore',
    customScoreId: 'customScore',
    customSliderId: 'customSlider',
    customwWaterId: 'water',
  });

  const _startGame = () => {
    playGameBtn.removeEventListener('click', _startGame, false);
    game.$start();
  };

  playGameBtn.addEventListener('click', _startGame, false);
  document.body.style.visibility = 'visible';
}
