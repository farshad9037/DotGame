import Dot from "./dot.js";

/**
 * @class Canvas
 */
export default class Canvas {
  /**
   * @constructor
   * @param {String} height
   * @param {String} width
   */
  constructor() {
    this._height = window.innerHeight;
    this._width = window.innerWidth;
    // Co-ordinates of clicked position
    this._clickedPos = { x: 0, y: 0 };
    this._dots = [new Dot()];
    this._isAnimate = false;
    this._dotsInterval = null;
  }

  create() {
    this._canvas = document.createElement('canvas');
    this._canvas.height = window.innerHeight;
    this._canvas.width = window.innerWidth;
    document.body.appendChild(this._canvas);

    this._canvas.addEventListener('mousedown', () => {
      this._clickedPos = { x: event.clientX, y: event.clientY };
    }, false);

    this._ctx = this._canvas.getContext("2d");
  }

  get clickedPos() {
    return this._clickedPos;
  }

  set clickedPos(value) {
    this._clickedPos = value;
  }

  get height() {
    return this._height;
  }

  get dots() {
    return this._dots;
  }

  get isAnimate() {
    return this._isAnimate;
  }

  set isAnimate(value) {
    this._isAnimate = value;
  }

  $pushDot() {
    this._dots.push(new Dot());
  }

  pushDotPerSec(frequency) {
    this._dotsInterval = setInterval(() => {
      // Check whether game is on before adding new dot
      if (this._isAnimate) {
        this._dots.push(new Dot());
        // canvas.$pushDot();
      }
    }, frequency);
  }

  $removeDot(index) {
    this._dots.splice(index, 1);
  }

  $clearRect() {
    // Reset clicked coordinates. Otherwise future dots of same coordinates will be considered as clicked
    this._clickedPos = { x: 0, y: 0 };
    this._ctx.clearRect(0, 0, this._width, this._height);
  }

  $draw(dot) {
    const { _x, _y, _radius, _color } = dot;
    this._ctx.beginPath();
    this._ctx.arc(_x, _y, _radius, 0, 2 * Math.PI);
    this._ctx.fillStyle = _color;
    this._ctx.fill();
    this._ctx.closePath();
  }

  $destroy() {
    clearInterval(this._dotsInterval);

    this._canvas.removeEventListener('mousedown', () => {
      this._clickedPos = { x: event.clientX, y: event.clientY };
    }, false);

    document.body.removeChild(this._canvas);
  }
}