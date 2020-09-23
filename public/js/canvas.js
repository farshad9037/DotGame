/**
 * @class Canvas
 */
export default class Canvas {
  /**
   * @constructor
   */
  constructor() {
    this._height = window.outerHeight;
    this.width = window.innerWidth;
    this._clickedPos = { x: 0, y: 0 };
    this.canvas = document.createElement('canvas');
    this.canvas.height = this._height;
    this.canvas.width = this.width;
    this.onMouseDown = () => this._clickedPos = { x: event.clientX, y: event.clientY };
    this.canvas.addEventListener('mousedown', this.onMouseDown, false);
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
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

  $clearRect() {
    this._clickedPos = { x: 0, y: 0 };
    this.ctx.clearRect(0, 0, this.width, this._height);
  }

  $draw(dot) {
    const { x, y, _radius, color } = dot;
    this.ctx.beginPath();
    this.ctx.arc(x, y, _radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  $destroy() {
    this.canvas.removeEventListener('mousedown', this.onMouseDown, false);
    document.body.removeChild(this.canvas);
  }
}