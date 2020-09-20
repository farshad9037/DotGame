import CONFIG from './config.js';
import Canvas from './canvas.js';

export default class Game {
  constructor() {
    this.canvas = new Canvas();
    this.playEl = document.getElementById("play");
    this.pauseEl = document.getElementById("pause");
    this.coverEl = document.getElementById('gameCover');
    this.headerEl = document.getElementById('gameHeader');
    this.gameOverEl = document.getElementById('gameOver');
    this.gameOverScoreEl = document.getElementById('gameOverScore');
    this.customScore = document.getElementById('customScore');
    this.customSlider = document.getElementById("customSlider");
    this.waterEl = document.getElementById('water');
    this.animateReq = null;
    this.bindEvents();
  }

  handleStatus = () => {
    if (this.canvas.isAnimate) {
      this.hide(this.playEl);
      this.show(this.pauseEl, 'flex')
    } else {
      this.hide(this.pauseEl);
      this.show(this.playEl, 'flex');
    }
  }

  start = () => {
    this.canvas.create();
    this.canvas.isAnimate = true;
    this.handleStatus();
    this.hide(this.coverEl);
    this.show(this.headerEl, 'flex');
    this.canvas.pushDotPerSec(CONFIG.frequency);
    this.animateReq = window.requestAnimationFrame(this.animate);
    this.getWaterLevel(100);
  }

  controlAnimation = () => {
    this.canvas.isAnimate = !this.canvas.isAnimate;
    this.canvas.clickedPos = { x: 0, y: 0 }
    this.handleStatus(this.canvas.isAnimate);
    this.animate();
  }

  onBlur = () => {
    this.canvas.isAnimate = false;
    this.handleStatus(this.canvas.isAnimate);
  }

  getWaterLevel = (value) => {
    if (value) {
      this.waterEl.style.minHeight = this.waterEl.style.minHeight ? `${parseFloat(this.waterEl.style.minHeight, 10) + value}px` : `${value}px`;
    }
    return parseFloat(this.waterEl.style.minHeight);
  }

  animate = () => {
    const { x: curX, y: curY } = this.canvas.clickedPos;
    const speed = this.customSlider.value;
    const waterLevel = this.getWaterLevel();
    this.canvas.$clearRect();
  
    this.canvas.dots.forEach((dot, index) => {
      this.canvas.$draw(dot);
      dot.$updateY(speed);
      dot.$handleClick(curX, curY, () => customScore.value += dot.points);
  
      if (dot.$isOutOfScreen(this.canvas.height - waterLevel)) {
        this.canvas.$removeDot(index);
        this.getWaterLevel(dot.radius);
      }
    });
  
    if (waterLevel >= this.canvas.height) {
      this.over();
    }
  
    if (!this.canvas.isAnimate) {
      window.cancelAnimationFrame(this.animateReq);
      return;
    }
    this.animateReq = window.requestAnimationFrame(this.animate);
  }

  bindEvents = () => {
    window.addEventListener('blur', this.onBlur, false);
    this.playEl.addEventListener('click', this.controlAnimation, false);
    this.pauseEl.addEventListener('click', this.controlAnimation, false);
  }

  unbindEvents = () => {
    window.removeEventListener('blur', this.onBlur, false);
    this.playEl.removeEventListener('click', controlAnimation, false);
    this.pauseEl.removeEventListener('click', controlAnimation, false);
  }

  hide(element) {
    element.style.display = 'none';
  }

  show(element, value) {
    element.style.display = value;
  }

  over() {
    this.canvas.isAnimate = false;
    this.hide(this.headerEl);
    this.show(this.gameOverEl, 'flex');
    this.gameOverScoreEl.innerText = customScore.innerText;
    this.unbindEvents();
    this.canvas.$destroy();
  }
};