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
    this._radius = Dot.randomInteger(1, 10) * minDiameter / 2;
    this.color = colors[this._radius * 2];
    this.x = Dot.randomInteger(maxDiameter / 2, window.innerWidth - maxDiameter / 2);
    this._y = -this._radius;
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
   * @returns {Number} Y co-ordinate of the dot 
   */
  get y() {
    return this._y;
  }
  /**
   * @param {Number} value y co-ordinate of the dot 
   */
  set y(value) {
    this._y = value;
  }
  /**
   * @param {Number} curX current clicked X
   * @param {Number} curY current clicked Y
   * @param {Function} cb callback function
   */
  $handleClick(curX, curY, cb) {
    const { x, y, _radius } = this;
    const isOnDot = curY > 0 && curX > x - _radius && curX < x + _radius && curY > y - _radius && curY < y + _radius;
    if (isOnDot) {
      this._radius = 0;
      cb && cb();
    }
    return isOnDot;
  }
  /**
   * @param {Element} refElement Reference element
   * @returns {Boolean} Whether dot is out of reference element
   */
  $isOutOfScreen(refElement) {
    return this._y > 0 && this._y > refElement.getBoundingClientRect().y;
  }
  /**
   * @param {Number} min Minimum integer (less than max).
   * @param {Number} max Maximum integer (greater than min).
   * @returns {Number} A random number between min and max
   */
  static randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};