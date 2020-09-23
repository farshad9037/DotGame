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
    this.canvas = new Canvas();
    this.minDotDiameter = minDotDiameter;
    this.maxDotDiameter = maxDotDiameter;
    this.colors = colors;
    this.dots = [new Dot(minDotDiameter, maxDotDiameter, colors)];
    this.dotsInterval = null;
    this.isAnimate = false;
    this.playEl = document.getElementById(playId);
    this.pauseEl = document.getElementById(pauseId);
    this.coverEl = document.getElementById(coverId);
    this.headerEl = document.getElementById(headerId);
    this.gameOverEl = document.getElementById(gameOverId);
    this.gameOverScoreEl = document.getElementById(gameOverScoreId);
    this.customScoreEl = document.getElementById(customScoreId);
    this.customSliderEl = document.getElementById(customSliderId);
    this.customWaterEl = document.getElementById(customwWaterId);
    this.dotFrequency = dotFrequency;
    this.animateReq = null;

    this.controlAnimation = () => {
      this.isAnimate = !this.isAnimate;
      this.canvas.clickedPos = { x: 0, y: 0 };
      this.handleStatus();
      this.animate();
    };

    this.onBlur = () => {
      this.isAnimate = false;
      this.handleStatus(this.isAnimate);
    };

    this.animate = () => {
      const { x: curX, y: curY } = this.canvas.clickedPos;
      const speed = this.customSliderEl.value;

      this.canvas.$clearRect();
      this.dots.forEach((dot, index) => {
        this.canvas.$draw(dot);
        dot.y += speed / 6;
        dot.$handleClick(curX, curY, () => (this.customScoreEl.value += dot.points));

        if (dot.$isOutOfScreen(this.customWaterEl)) {
          this.dots.splice(index, 1);
          if (dot.radius > 0) {
            this.customWaterEl.$fill(dot.radius);
          }
        }
      });

      if (this.customWaterEl.minHeight >= this.canvas.height) {
        this.over();
      }

      if (!this.isAnimate) {
        window.cancelAnimationFrame(this.animateReq);
        return;
      }
      this.animateReq = window.requestAnimationFrame(this.animate);
    };

    this.handleStatus = () => {
      if (this.isAnimate) {
        Game.hide(this.playEl);
        Game.show(this.pauseEl, "flex");
      } else {
        Game.hide(this.pauseEl);
        Game.show(this.playEl, "flex");
      }
    };

    this.bindEvents();
  }
  /**
   * bind all the events required for the game
   */
  bindEvents() {
    window.addEventListener("blur", this.onBlur, false);
    this.playEl.addEventListener("click", this.controlAnimation, false);
    this.pauseEl.addEventListener("click", this.controlAnimation, false);
  };
  /**
   * destroy all the events required for the game
   */
  unbindEvents() {
    window.removeEventListener("blur", this.onBlur, false);
    this.playEl.removeEventListener("click", this.controlAnimation, false);
    this.pauseEl.removeEventListener("click", this.controlAnimation, false);
  };
  /**
   * Insert dots
   */
  pushDot() {
    this.dotsInterval = setInterval(() => {
      if (this.isAnimate) {
        this.dots.push(new Dot(this.minDotDiameter, this.maxDotDiameter, this.colors));
      }
    }, this.dotFrequency);
  }
  /**
   * Handles game over
   */
  over() {
    this.isAnimate = false;
    Game.hide(this.headerEl);
    Game.show(this.gameOverEl, "flex");
    this.gameOverScoreEl.innerText = String(this.customScoreEl.value);
    this.unbindEvents();
    window.clearInterval(this.dotsInterval);
    this.canvas.$destroy();
  }
  /**
   * Handles game start
   */
  $start() {
    this.isAnimate = true;
    this.handleStatus();
    Game.hide(this.coverEl);
    Game.show(this.headerEl, "flex");
    this.pushDot();
    this.animateReq = window.requestAnimationFrame(this.animate);
  };
  /**
   * @param {Element} element
   * Hide the element
   */
  static hide(element) {
    element.style.display = "none";
  }
  /**
   * @param {Element} element Element to show
   * @param {String} value |'flex'|'block'|'inline-bloc'|'inline'|
   * Update the display property of the element
   */
  static show(element, value) {
    element.style.display = value;
  }
}
