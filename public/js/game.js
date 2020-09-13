/**
 * @class Game
 */
import CONFIG from './config.js';

export default class Game {
  constructor() {
    this.isPlaying = false; // Whether game is on or pause/off
    this.level = CONFIG.level;
    this.dots = []; // List of all dots
    this.clickedPos = { x: 0, y: 0 }; // Co-ordinates of clicked position
    this.score = 0; // Total score
    this.lostDotsCount = 0; // count of lost dots
    this.dotsInterval = null;
  }

  setIsPlaying(value) {
    this.isPlaying = value;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  setLevel(value) {
    this.level = value;
  }

  getLevel() {
    return this.level;
  }
};