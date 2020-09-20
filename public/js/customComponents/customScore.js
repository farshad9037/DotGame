class customScore extends HTMLElement {
  constructor() {
    super();
    this.id = this.getAttribute('id');
    this.label = this.getAttribute('label');
    this._value = 0;
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `
      <style>
        .score {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        .number {
          font-size: 2.5em;
        }

        .line-height-0 {
          line-height: 0;
        }
      </style>
      <div class="score">
        <span>${this.label}</span>
        <span id="score" class="number">${this._value}</span>
        <span class="line-height-0">coins</span>
      </div>
    `;
  }

  connectedCallback() {
    this.score = this.shadow.getElementById('score');
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.score.innerText = value;
  }
}

customElements.define('custom-score', customScore);