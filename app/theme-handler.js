import { LitElement, css, html } from "lit";

class ThemeToggler extends LitElement {
  static get properties() {
    return {
      brand: { state: true },
      color: { state: true },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          padding: 10px;
          background-color: lightgrey;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          font-size: 14px;
        }

        select {
          display: block;
          font-size: 16px;
          width: 100px;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.color = "green";
    this.brand = "casual";
  }

  updated() {
    this.updateTheme();
  }

  render() {
    return html`
      <label>
        Color
        <select @change=${this.onColorChange}>
          <option>green</option>
          <option>blue</option>
          <option>purple</option>
        </select>
      </label>
      <label>
        Brand
        <select @change=${this.onBrandChange}>
          <option>casual</option>
          <option>business</option>
        </select>
      </label>
    `;
  }

  async updateTheme() {
    const { default: sheet } = await import(
      `./styles/semantic-${this.brand}-${this.color}.css`,
      {
        with: { type: "css" },
      }
    );

    sheet.theme = true;
    document.adoptedStyleSheets = [
      ...document.adoptedStyleSheets.filter((sheet) => !sheet.theme),
      sheet,
    ];
  }

  onColorChange(ev) {
    const val = ev.target.selectedOptions[0].value;
    this.color = val;
  }

  onBrandChange(ev) {
    const val = ev.target.selectedOptions[0].value;
    this.brand = val;
  }
}
customElements.define("theme-toggler", ThemeToggler);
