/**
 * @class Dot
 */
import CONFIG from './config.js';
import { getRandomInteger } from './utils.js';

export default class Dot {
  constructor() {
    /** Genereate random radius */
    this._radius = this.getRandomInteger(1, 10) * CONFIG.minDotDiameter / 2; // Random radius between 10 and 100
    /** Pick color from the configuration */
    this._color = CONFIG.colors[this._radius * 2];
    /** Random X co-ordinate of the dot ranges from 100 to (canvas width - 100)*/
    this._x = this.getRandomInteger(CONFIG.maxDotDiameter / 2, window.outerWidth - CONFIG.maxDotDiameter / 2);
    /** Initial Y co-ordinate of the dot */
    this._y = -this._radius;
    /** Points inversely proportional to radius */
    this._points = (CONFIG.maxDotDiameter - this._radius * 2) / 10 + 1;
  }

  get points() {
    return this._points;
  }

  get radius() {
    return this._radius;
  }

  $updateY(sliderValue) {
    /**
     * Speed range is 10px ~ 100px per second based on the configuration.
     * requestAnimationFrame repaint every 1/60 seconds. So (y += slider.value / 60 * <10 ~ 100>) adds (10 ~ 100) every second
    */
    this._y += sliderValue / 6;
  }

  $pop() {
    this._radius = 0;
  }

  $handleClick(curX, curY, cb) {
    try {
      if (isNaN(curX)) throw "curX must be a number";
      if (isNaN(curY)) throw "curY must be a number";
    } catch (error) {
      console.error(error);
    } finally {
      const { _x, _y, _radius } = this;
      const isOnDot = curY > 0 && curX > _x - _radius && curX < _x + _radius && curY > _y - _radius && curY < _y + _radius;
      if (isOnDot) {
        this._radius = 0;
        cb && cb();
      }
      return isOnDot;
    }
  }

  $isOutOfScreen(refHeight) {
    try {
      if (isNaN(refHeight)) throw "refHeight is not a number";
      if (refHeight <= 0) throw "refHeight must be greater than 1";
    } catch (error) {
      console.error(error);
    } finally {
      return this._y > refHeight + CONFIG.maxDotDiameter
    }
  }
  /**
   * @param {Number} min Minimum integer (less than max).
   * @param {Number} max Maximum integer (greater than min).
   * @returns {Number} A random number between min and max
   */
  getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};