/**
 * @customComponent customLogo
 */
class customLogo extends HTMLElement {
  /**
   * @constructor
   * @prop {String} id ID of the element
   * @prop {String} label Content of the logo
   */
  constructor() {
    super();
    this.id = this.getAttribute('id');
    this.label = this.getAttribute('label');
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `
      <style>
      .logo {
        color: #008b8b;
        font-family: cursive;
        font-size: 4em;
        margin: 0;
        padding: 0.67em;
        text-shadow: 2px 2px #235067;
      }
      </style>
      <h1 id="${this.id}" class="logo" aria-label="${this.label}">${this.label}</h1>
    `;
  }
}

customElements.define('custom-logo', customLogo);