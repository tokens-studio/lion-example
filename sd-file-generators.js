import { semanticFilter, componentFilter } from "./sd-filters.js";

const commonFileOptions = {
  format: "css/variables",
  options: {
    selector: ":host",
  },
};

export const generateSemanticFiles = (components, theme) => {
  const filesArr = [];
  // theme-specific outputs
  filesArr.push({
    ...commonFileOptions,
    filter: semanticFilter(components, true),
    destination: `styles/semantic-${theme.toLowerCase()}.css`,
  });

  // not theme-specific outputs
  filesArr.push({
    ...commonFileOptions,
    filter: semanticFilter(components, false),
    destination: `styles/semantic.css`,
  });

  return filesArr;
};

// for each component (currently only button), filter those specific component tokens and output them
// to the component folder where the component source code will live
export const generateComponentFiles = (components, theme) => {
  const filesArr = [];

  for (const comp of components) {
    // theme-specific outputs
    filesArr.push({
      ...commonFileOptions,
      filter: componentFilter(comp, true),
      destination: `${comp}/${comp}-${theme.toLowerCase()}.css`,
    });

    // not theme-specific outputs
    filesArr.push({
      ...commonFileOptions,
      filter: componentFilter(comp, false),
      destination: `${comp}/${comp}.css`,
    });
  }
  return filesArr;
};
