// filters only tokens originating from core.json
export const coreFilter = (tokenFolder) => (token) =>
  token.filePath.startsWith(`${tokenFolder}/primitive/`);

// filters only tokens originating from semantic sets (not core, not components) and also check themeable or not
export const semanticFilter =
  (themeable = false, tokenFolder) =>
  (token) => {
    const tokenPath = token.filePath
      .split(`${tokenFolder}/`)[1]
      .split(".json")[0];
    const tokenThemable = Boolean(token.attributes.themeable);
    return (
      themeable === tokenThemable &&
      !(
        tokenPath.startsWith("primitive/") || tokenPath.startsWith("component/")
      )
    );
  };

// filters tokens by themable and from which tokenset they originate
// must match per component name, in this repository we currently only have "button"
export const componentFilter = (cat, tokenFolder) => (token) =>
  token.filePath === `${tokenFolder}/component/${cat}.json`;
