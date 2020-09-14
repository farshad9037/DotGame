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
    this._height = window.outerHeight;
    this._width = window.innerWidth;
    // Co-ordinates of clicked position
    this._clickedPos = { x: 0, y: 0 };
    this._canvas = null;
  }

  create() {
    let canvasEle = document.createElement('canvas');
    canvasEle.height = window.outerHeight;
    canvasEle.width = window.innerWidth;
    document.body.appendChild(canvasEle);
    this._canvas = canvasEle;

    this._canvas.addEventListener('mousedown', () => {
      this._clickedPos = { x: event.clientX, y: event.clientY };
    }, false);

    window.addEventListener('resize', () => {
      this._canvas.height = window.outerHeight;
      this._canvas.width = window.innerWidth;
    }, false);

    this._ctx = canvasEle.getContext("2d");
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

  clearRect() {
    // Reset clicked coordinates. Otherwise future dots of same coordinates will be considered as clicked
    this._clickedPos = { x: 0, y: 0 };
    this._ctx.clearRect(0, 0, this._width, this._height);
  }

  update(dot) {
    const { x, y, radius, color } = dot;
    this._ctx.beginPath();
    this._ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this._ctx.fillStyle = color;
    this._ctx.fill();
    this._ctx.closePath();
  }

  _setSize() {
    this._canvas.height = window.outerHeight;
    this._canvas.width = window.innerWidth;
  }

  $destroy() {
    this._canvas.removeEventListener('mousedown', () => {
      this._clickedPos = { x: event.clientX, y: event.clientY };
    }, false);

    window.removeEventListener('resize', () => {
      this._canvas.height = window.outerHeight;
      this._canvas.width = window.innerWidth;
    }, false);

    document.body.removeChild(this._canvas);
  }
}