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
    this.height = window.outerHeight;
    this.width = window.innerWidth;
    this.clickedPos = { x: 0, y: 0 }; // Co-ordinates of clicked position
    this.canvas = null;
  }

  create() {
    let canvas = document.createElement('canvas');
    canvas.height = window.outerHeight;
    canvas.width = window.innerWidth;
    document.body.appendChild(canvas);

    canvas.addEventListener('mousedown', () => {
      this.clickedPos = { x: event.clientX, y: event.clientY };
    }, false);

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  getContext() {
    return this.canvas.getContext("2d");
  }

  setClickedPos(x, y) {
    this.clickedPos = { x, y };
  }

  getClickedPos(x, y) {
    return this.clickedPos;
  }

  clearRect() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  update(dot) {
    const { x, y, radius, color } = dot;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  setSize() {
    this.canvas.style.height = `${window.outerHeight}px`;
    this.canvas.style.width = `${window.innerWidth}px`;
  }

  onMousedown(callback) {
    canvas.addEventListener('onmousedown', callback, false);
  }
}