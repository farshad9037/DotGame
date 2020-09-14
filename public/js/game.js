/**
 * @class Game
 */
import CONFIG from './config.js';

export default class Game {
  constructor() {
    this._isPlaying = false; // Whether game is on or pause/off
    this._level = CONFIG.level;
    this.dots = []; // List of all dots
    this.clickedPos = { x: 0, y: 0 }; // Co-ordinates of clicked position
    this.score = 0; // Total score
    this.lostDotsCount = 0; // count of lost dots
    this.dotsInterval = null;
  }

  get isPlaying() {
    return this._isPlaying;
  }

  set isPlaying(value) {
    this._isPlaying = value;
  }

  get level() {
    return this._level;
  }

  set level(value) {
    this._level = value;
  }

  $isLost() {
    return this.lostDotsCount === CONFIG.maxLostCount
  }
};