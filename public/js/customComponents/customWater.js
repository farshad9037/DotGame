/**
 * @customComponent customWater
 */
class customWater extends HTMLElement {
  /**
   * @constructor
   * @prop {String} id ID of the element
   * @prop {String} minHeight Minimum water level
   */
  constructor() {
    super();
    this._id = this.getAttribute('id');
    this._minHeight = parseFloat(this.getAttribute('min-height'));
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `
      <style>
        .water {
          overflow: hidden;
          background-color: #04acff;
          position: absolute;
          bottom: 0;
          width: 100%;
          border-radius: 25% 15% 0 0;
          transition: min-height 1s;
          transition-timing-function: cubic-bezier(0.2, 0.6, 0.8, 0.4);
        }
      </style>
      <div id="${this._id}" class="water"></div>
    `;
  }

  connectedCallback() {
    this._water = this.shadow.getElementById(this._id);
    this._water.style.minHeight = `${this._minHeight}px`;
  }

  get minHeight() {
    return this._minHeight;
  }

  $fill(level) {
    this._minHeight += level;
    this._water.style.minHeight = `${this._minHeight}px`
  }
}

customElements.define('custom-water', customWater);