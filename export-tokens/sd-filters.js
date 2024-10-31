// filters only tokens originating from core.json
export const coreFilter = (token) =>
  token.filePath.startsWith("tokens/primitive/");

// filters only tokens originating from semantic sets (not core, not components) and also check themeable or not
export const semanticFilter =
  (themeable = false) =>
  (token) => {
    const themeDimensions = ["color", "brand"];
    const tokenThemable = Boolean(token.attributes.themeable);
    return (
      themeable === tokenThemable &&
      [...themeDimensions, "semantic"].some((cat) =>
        token.filePath.startsWith(`tokens/${cat}/`)
      )
    );
  };

// filters tokens by themable and from which tokenset they originate
// must match per component name, in this repository we currently only have "button"
export const componentFilter = (cat) => (token) =>
  token.filePath === `tokens/component/${cat}.json`;
