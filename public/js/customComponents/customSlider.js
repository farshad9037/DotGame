/**
 * @customComponent customSlider
 */
class customSlider extends HTMLElement {
  /**
   * @constructor
   * @prop {String} id ID of the element
   * @prop {String} label Label of the slider
   * @prop {String} min Minimun value
   * @prop {String} max Maximum value
   * @prop {String} value Initial value
   */
  constructor() {
    super();
    this.id = this.getAttribute('id');
    this.label = this.getAttribute('label');
    this.min = this.getAttribute('min');
    this.max = this.getAttribute('max');
    this._value = this.getAttribute('value');
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `
      <style>
        .wrapper {
          text-align: center;
          width: 220px;
        }

        .number {
          font-size: 1.5em;
        }

        .slider {
          -webkit-appearance: none;
          -webkit-transition: .1s;
          appearance: none;
          background: linear-gradient(45deg, transparent, black);
          width: 100%;
          outline: none;
          transition: opacity .1s;
        }

        .slider::hover {
          opacity: 1;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          background: #ffffff;
          border-radius: 10px;
          cursor: pointer;
          height: 20px;
          width: 20px;
        }
      </style>
      <div class="wrapper">
        <label for="slider" title="level" aria-labelledby="slider">
          <span class="label">${this.label}</span>
          <span class="number" id="currentLevel">${this.value}</span>
          <input type="range" min=${this.min} max=${this.max} value=${this.value} class="slider" id="slider">
        </label>
      </div>
    `;
    this.setValue = (event) => {
      this._value = parseInt(event.target.value, 10);
      this.currentLevel.innerText = this.value;
    }
  }

  connectedCallback() {
    this.input = this.shadow.querySelector('input');
    this.currentLevel = this.shadow.getElementById('currentLevel');
    this.input.addEventListener('input', this.setValue, false);
  }

  disconnectedCallback() {
    this.input.removeEventListener('input', this.setValue, false);
  }

  get value() {
    return parseInt(this._value, 10);
  }

  set value(value) {
    this._value = value;
  }
}

customElements.define('custom-slider', customSlider);