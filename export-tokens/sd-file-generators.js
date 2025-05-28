import { outputReferencesTransformed } from "style-dictionary/utils";
import { coreFilter, semanticFilter, componentFilter } from "./sd-filters.js";

const format = "css/variables";

export const generateCoreFiles = (tokenFolder) => [
  {
    destination: "app/styles/core.css",
    format: "css/variables",
    filter: coreFilter(tokenFolder),
  },
];

export const generateSemanticFiles = (theme, tokenFolder) => {
  const filesArr = [];
  // theme-specific outputs
  filesArr.push({
    format,
    filter: semanticFilter(true, tokenFolder),
    destination: `app/styles/semantic-${theme.toLowerCase()}.css`,
  });

  // not theme-specific outputs
  filesArr.push({
    format,
    filter: semanticFilter(false, tokenFolder),
    destination: `app/styles/semantic.css`,
  });

  return filesArr;
};

// for each component (currently only button), filter those specific component tokens and output them
// to the component folder where the component source code will live
export const generateComponentFiles = (components, tokenFolder) => {
  const filesArr = [];

  for (const comp of components) {
    filesArr.push({
      format,
      filter: componentFilter(comp, tokenFolder),
      options: {
        // since these will be used in ShadowDOM
        selector: ":host",
        outputReferences: outputReferencesTransformed,
      },
      destination: `components/${comp}/${comp}.css`,
    });
  }
  return filesArr;
};
