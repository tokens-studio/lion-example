import { LionButtonSubmit } from "@lion/ui/button.js";
import { css } from "lit";
import tokens from "./button.css" with { type: "css" };

class TokButton extends LionButtonSubmit {
  static get styles() {
    return [
      ...super.styles,
      tokens,
      css`
        :host {
          color: var(--button-text-color);
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
}

customElements.define("tok-button", TokButton);
