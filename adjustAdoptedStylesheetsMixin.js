export const adjustAdoptedStylesheetsMixin = (superclass) =>
  class extends superclass {
    connectedCallback() {
      super.connectedCallback();
      document
        .querySelector("theme-toggler")
        .addEventListener("theme-change", (ev) => {
          this.adjustAdoptedStylesheets(ev.detail);
        });
    }

    async adjustAdoptedStylesheets({ brand, color }) {
      // Note: dynamic import vars like this are hard to statically analyse
      // May want to refactor to a switch case with all possible variants
      // Something like https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars may help
      const { default: sheet } = await import(
        `./${this.component}/${this.component}-${brand}-${color}.css`,
        {
          assert: { type: "css" },
        }
      );

      sheet.theme = true;
      this.shadowRoot.adoptedStyleSheets = [
        ...this.shadowRoot.adoptedStyleSheets.filter((sheet) => !sheet.theme),
        sheet,
      ];
    }
  };
