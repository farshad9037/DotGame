"use strict";

import './js/customComponents/customSlider.js';
import './js/customComponents/customScore.js';
import Game from './js/game.js';
import CONFIG from './js/config.js';

window.onload = () => {
  const playGameBtn = document.getElementById('playGameBtn');
  const game = new Game({
    playId: 'play',
    pauseId: 'pause',
    coverId: 'gameCover',
    headerId: 'gameInfo',
    gameOverId: 'gameOver',
    gameOverScoreId: 'gameOverScore',
    customScoreId: customScore,
    customSliderId: 'customSlider',
    waterId: 'water',
    dotFrequency: CONFIG.frequency,
  });

  const _startGame = () => {
    playGameBtn.removeEventListener('click', _startGame, false);
    game.$start();
  };

  playGameBtn.addEventListener('click', _startGame, false);
}
