import Canvas from "./canvas.js";
import Dot from "./dot.js";

/**
 * @class Game
 */
export default class Game {
  /**
   * @constructor
   * @param {String} playId ID of play button
   * @param {String} pauseId ID of pause button
   * @param {String} coverId ID of cover screen
   * @param {String} headerId ID of header
   * @param {String} gameOverScoreId ID of game over score
   * @param {String} customScoreId ID of custom score component
   * @param {String} customSliderId ID of custom slider component
   * @param {String} customwWaterId ID of water flow content
   * @param {Number} dotFrequency Frequeny of dot fall
  */
  constructor({ minDotDiameter, maxDotDiameter, colors, playId, pauseId, coverId, headerId, gameOverId, gameOverScoreId, customScoreId, customSliderId, customwWaterId, dotFrequency }) {
    this._canvas = new Canvas();
    this.minDotDiameter = minDotDiameter;
    this.maxDotDiameter = maxDotDiameter;
    this.colors = colors;
    this.dots = [new Dot(minDotDiameter, maxDotDiameter, colors)];
    this.dotsInterval = null;
    this.isAnimate = false;
    this._playEl = document.getElementById(playId);
    this._pauseEl = document.getElementById(pauseId);
    this._coverEl = document.getElementById(coverId);
    this._headerEl = document.getElementById(headerId);
    this._gameOverEl = document.getElementById(gameOverId);
    this._gameOverScoreEl = document.getElementById(gameOverScoreId);
    this._customScore = document.getElementById(customScoreId);
    this._customSlider = document.getElementById(customSliderId);
    this._customWaterEl = document.getElementById(customwWaterId);
    this._dotFrequency = dotFrequency;
    this._animateReq = null;
    this._bindEvents();
  }
  /**
   * bind all the events required for the game
   */
  _bindEvents = () => {
    window.addEventListener("blur", this._onBlur, false);
    this._playEl.addEventListener("click", this._controlAnimation, false);
    this._pauseEl.addEventListener("click", this._controlAnimation, false);
  };
  /**
   * destroy all the events required for the game
   */
  _unbindEvents = () => {
    window.removeEventListener("blur", this._onBlur, false);
    this._playEl.removeEventListener("click", this._controlAnimation, false);
    this._pauseEl.removeEventListener("click", this._controlAnimation, false);
  };
  /**
   * Control the animations on play/pause
   */
  _controlAnimation = () => {
    this.isAnimate = !this.isAnimate;
    this._canvas.clickedPos = { x: 0, y: 0 };
    this._handleStatus();
    this._animate();
  };
  /**
   * Even listner that pause the game if user is out of focus
   */
  _onBlur = () => {
    this.isAnimate = false;
    this._handleStatus(this.isAnimate);
  };
  /**
   * Toggle play/pause button
   */
  _handleStatus = () => {
    if (this.isAnimate) {
      this._hide(this._playEl);
      this._show(this._pauseEl, "flex");
    } else {
      this._hide(this._pauseEl);
      this._show(this._playEl, "flex");
    }
  };

  _pushDot() {
    this.dotsInterval = setInterval(() => {
      if (this.isAnimate) {
        console.log(this.dots.length);
        this.dots.push(new Dot(this.minDotDiameter, this.maxDotDiameter, this.colors));
      }
    }, this._dotFrequency);
  }
  /**
   * Handle dot falling / water filling animations
   */
  _animate = () => {
    const { x: curX, y: curY } = this._canvas.clickedPos;
    const speed = this._customSlider.value;

    this._canvas.$clearRect();

    this.dots.forEach((dot, index) => {
      this._canvas.$draw(dot);
      dot.$updateY(speed);
      dot.$handleClick(curX, curY, () => (customScore.value += dot.points));

      if (dot.$isOutOfScreen(this._customWaterEl)) {
        this.dots.splice(index, 1);
        if (dot.radius > 0) {
          this._customWaterEl.$fill(dot.radius);
        }
      }
    });

    if (this._customWaterEl.minHeight >= this._canvas.height) {
      this._over();
    }

    if (!this.isAnimate) {
      window.cancelAnimationFrame(this._animateReq);
      return;
    }
    this._animateReq = window.requestAnimationFrame(this._animate);
  };
  /**
   * @param {Element} element
   * Hide the element
   */
  _hide(element) {
    element.style.display = "none";
  }
  /**
   * @param {Element} element Element to show
   * @param {String} value |'flex'|'block'|'inline-bloc'|'inline'|
   * Update the display property of the element
   */
  _show(element, value) {
    element.style.display = value;
  }
  /**
   * Handles game over
   */
  _over() {
    this.isAnimate = false;
    this._hide(this._headerEl);
    this._show(this._gameOverEl, "flex");
    this._gameOverScoreEl.innerText = String(customScore.value);
    this._unbindEvents();
    window.clearInterval(this.dotsInterval);
    this._canvas.$destroy();
  }
  /**
   * Handles game start
   */
  $start() {
    this.isAnimate = true;
    this._handleStatus();
    this._hide(this._coverEl);
    this._show(this._headerEl, "flex");
    this._pushDot();
    this._animateReq = window.requestAnimationFrame(this._animate);
  };
}
