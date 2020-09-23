/**
 * @class Dot
 */
export default class Dot {
  /**
   * @constructor
   * @param {String} minDiameter Minimum diameter of dot
   * @param {String} maxDiameter Maximum diameter of dot
   * @param {Object} colors colors object
   */
  constructor(minDiameter, maxDiameter, colors) {
    this._radius = this.getRandomInteger(1, 10) * minDiameter / 2; // Random radius between 10 and 100
    this.color = colors[this._radius * 2];
    this.x = this.getRandomInteger(maxDiameter / 2, window.innerWidth - maxDiameter / 2);
    this.y = -this._radius;
    this._points = (maxDiameter - this._radius * 2) / 10 + 1;
  }
  /**
   * @returns {Number} Points of the dot 
   */
  get points() {
    return this._points;
  }
  /**
   * @returns {Number} Radius of the dot 
   */
  get radius() {
    return this._radius;
  }
  /**
   * @param {Number} speed to which dot move
   */
  $updateY(speed) {
    try {
      if (isNaN(speed)) throw "speed must be a number";
      if (speed <= 0) throw "speed must be greater than 0";
    } catch (error) {
      console.error(error);
    } finally {
      /**
       * Speed range is 10px ~ 100px per second based on the configuration.
       * requestAnimationFrame repaint every 1/60 seconds. So (y += speed / 60 * <10 ~ 100>) adds (10 ~ 100) every second
       */
      this.y += speed / 6;
    }
  }
  /**
   * @param {Number} curX current clicked X
   * @param {Number} curY current clicked Y
   * @param {Function} cb callback function
   */
  $handleClick(curX, curY, cb) {
    try {
      if (isNaN(curX)) throw "curX must be a number";
      if (isNaN(curY)) throw "curY must be a number";
    } catch (error) {
      console.error(error);
    } finally {
      const { x, y, _radius } = this;
      const isOnDot = curY > 0 && curX > x - _radius && curX < x + _radius && curY > y - _radius && curY < y + _radius;
      if (isOnDot) {
        this._radius = 0;
        cb && cb();
      }
      return isOnDot;
    }
  }
  /**
   * @param {Element} refElement Reference element
   * @returns {Boolean} Whether dot is out of reference element
   */
  $isOutOfScreen(refElement) {
    try {
      if (!refElement) throw "first argument is not passed";
    } catch (error) {
      console.error(error);
    } finally {
      return this.y > 0 && this.y > refElement.getBoundingClientRect().y;
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