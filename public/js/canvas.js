import Dot from "./dot.js";

/**
 * @class Canvas
 */
export default class Canvas {
  /**
   * @constructor
   */
  constructor() {
    this._height = window.outerHeight;
    this._width = window.innerWidth;
    this._clickedPos = { x: 0, y: 0 };
    this._dots = [new Dot()];
    this._isAnimate = false;
    this._dotsInterval = null;
    this._canvas = document.createElement('canvas');
    this._canvas.height = this._height;
    this._canvas.width = this._width;
    this._canvas.addEventListener('mousedown', this._onMouseDown, false);
    this._ctx = this._canvas.getContext("2d");
    document.body.appendChild(this._canvas);
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

  _onMouseDown = () => {
    this._clickedPos = { x: event.clientX, y: event.clientY };
  }

  $pushDot(frequency) {
    this._dotsInterval = setInterval(() => {
      if (this._isAnimate) {
        this._dots.push(new Dot());
      }
    }, frequency);
  }

  $removeDot(index) {
    this._dots.splice(index, 1);
  }

  $clearRect() {
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
    this._canvas.removeEventListener('mousedown', this._onMouseDown, false);
    document.body.removeChild(this._canvas);
  }
}