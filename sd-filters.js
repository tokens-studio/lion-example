// filters only tokens originating from core.json
export const coreFilter = (token) => token.filePath.endsWith("core.json");

// filters only tokens originating from semantic sets (not core, not components) and also check themeable or not
export const semanticFilter =
  (components, themeable = false) =>
  (token) => {
    const tokenThemable = Boolean(token.attributes.themeable);
    return (
      themeable === tokenThemable &&
      ["core", ...components].every(
        (cat) => !token.filePath.endsWith(`${cat}.json`)
      )
    );
  };
// filters tokens by themable and from which tokenset they originate
// must match per component name, in this repository we currently only have "button"
export const componentFilter =
  (cat, themeable = false) =>
  (token) => {
    const tokenThemable = Boolean(token.attributes.themeable);
    return (
      themeable === tokenThemable && token.filePath.endsWith(`${cat}.json`)
    );
  };
