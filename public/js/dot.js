/**
 * @class Dot
 */
import CONFIG from './config.js';
import { getRandomInteger } from './utils.js';

export default class Dot {
  constructor() {
    this.radius = getRandomInteger(1, 10) * CONFIG.minDotDiameter / 2; // Random radius between 10 and 100
    this.color = CONFIG.colors[this.radius * 2];
    // Random X co-ordinate of the dot ranges from 100 to (canvas width - 100)
    this.x = getRandomInteger(CONFIG.maxDotDiameter / 2, window.outerWidth - CONFIG.maxDotDiameter / 2);
    this.y = -this.radius; // Initial Y co-ordinate of the dot
    this.points = (CONFIG.maxDotDiameter - this.radius * 2) / 10 + 1; // Points inversely proportional to radius
    this.isClicked = false;
  }
};