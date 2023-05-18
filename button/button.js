import { LionButtonSubmit } from "@lion/ui/button.js";
import { css } from "lit";
import { adjustAdoptedStylesheetsMixin } from "../adjustAdoptedStylesheetsMixin.js";

class TokButton extends adjustAdoptedStylesheetsMixin(LionButtonSubmit) {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background: var(--button-bg-color);
          border-radius: var(--button-border-radius);
        }

        :host(:hover),
        :host([active]) {
          background: var(--button-bg-color);
          filter: brightness(1.2);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.component = "button";
  }
}

customElements.define("tok-button", TokButton);
