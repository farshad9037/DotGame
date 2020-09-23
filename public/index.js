"use strict";

import './js/customComponents/customSlider.js';
import './js/customComponents/customScore.js';
import './js/customComponents/customWater.js';
import './js/customComponents/customLogo.js';
import Game from './js/classes/game.js';
import CONFIG from './config.js';

window.onload = () => {
  const playGameBtn = document.getElementById('playGameBtn');
  const game = new Game({
    minDotDiameter: CONFIG.minDotDiameter,
    maxDotDiameter: CONFIG.maxDotDiameter,
    colors: CONFIG.colors,
    playId: 'play',
    pauseId: 'pause',
    coverId: 'gameCover',
    headerId: 'gameInfo',
    gameOverId: 'gameOver',
    gameOverScoreId: 'gameOverScore',
    customScoreId: customScore,
    customSliderId: 'customSlider',
    customwWaterId: 'water',
    dotFrequency: CONFIG.frequency,
  });

  const _startGame = () => {
    playGameBtn.removeEventListener('click', _startGame, false);
    game.$start();
  };

  playGameBtn.addEventListener('click', _startGame, false);
}
