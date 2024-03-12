import { LionButtonSubmit } from "@lion/ui/button.js";
import { css } from "lit";
import { adjustAdoptedStylesheetsMixin } from "../adjustAdoptedStylesheetsMixin.js";

class TokButton extends adjustAdoptedStylesheetsMixin(LionButtonSubmit) {
  static get styles() {
    return [
      ...super.styles,
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

  constructor() {
    super();
    this.component = "button";

    // This can probably be its own mixin as well...
    import(`./button.css`, {
      assert: { type: "css" },
    }).then(({ default: sheet }) => {
      this.shadowRoot.adoptedStyleSheets = [
        ...this.shadowRoot.adoptedStyleSheets,
        sheet,
      ];
    });
  }
}

customElements.define("tok-button", TokButton);
