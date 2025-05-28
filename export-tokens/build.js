import StyleDictionary from "style-dictionary";
import { getReferences, usesReferences } from "style-dictionary/utils";
import { register, permutateThemes } from "@tokens-studio/sd-transforms";
import fs from "node:fs/promises";
import path from "node:path";
import {
  generateCoreFiles,
  generateSemanticFiles,
  generateComponentFiles,
} from "./sd-file-generators.js";

register(StyleDictionary);

const tokenFolder = "tokens";
// list of components that we have tokens for, assume the tokenset path for it is component/${comp}.json
const components = ["button"];

async function run() {
  const $themes = JSON.parse(await fs.readFile(`${tokenFolder}/$themes.json`));
  const themes = permutateThemes($themes);
  // collect all tokensets for all themes and dedupe
  const tokensets = [
    ...new Set(
      Object.values(themes).reduce((acc, sets) => [...acc, ...sets], [])
    ),
  ];
  // figure out which tokensets are theme-specific
  // this is determined by checking if a certain tokenset is used for EVERY theme dimension variant
  // if it is, then it is not theme-specific
  const themeableSets = tokensets.filter((set) => {
    return !Object.keys(
      $themes.find((t) => t.name === "_" && t.group === "_").selectedTokenSets
    ).includes(set);
  });

  const configs = Object.entries(themes).map(([theme, sets]) => ({
    source: sets.map((tokenset) => `${tokenFolder}/${tokenset}.json`),
    preprocessors: ["tokens-studio"],
    platforms: {
      css: {
        transformGroup: "tokens-studio",
        transforms: ["attribute/themeable", "name/kebab"],
        files: [
          // core tokens, e.g. for application developer, although in this project we don't really use core tokens directly, which is common
          ...generateCoreFiles(tokenFolder),
          // semantic tokens, e.g. for application developer
          ...generateSemanticFiles(theme.replace(/^_-/g, ""), tokenFolder),
          // component tokens, e.g. for design system developer
          ...generateComponentFiles(components, tokenFolder),
        ],
      },
    },
  }));

  for (const cfg of configs) {
    const sd = new StyleDictionary(cfg);

    /**
     * This transform checks for each token whether that token's value could change
     * due to Tokens Studio theming.
     * Any tokenset from Tokens Studio marked as "enabled" in the $themes.json is considered
     * a set in which any token could change if the theme changes.
     *
     * Any token that is inside such a set or is a reference with a token in that reference chain
     * that is inside such a set, is considered "themeable",
     * which means it could change by theme switching.
     *
     * This metadata is applied to the token so we can use it as a way of filtering outputs
     * later in the "format" stage.
     */
    sd.registerTransform({
      name: "attribute/themeable",
      type: "attribute",
      transform: (token) => {
        function isPartOfEnabledSet(token) {
          const { dir, name } = path.parse(token.filePath);
          const tokenPath = `${dir.split(`${tokenFolder}/`)[1]}/${name}`;
          return themeableSets.includes(tokenPath);
        }

        // Set token to themeable if it's part of an enabled set
        if (isPartOfEnabledSet(token)) {
          return {
            themeable: true,
          };
        }

        // Set token to themeable if it's using a reference and inside the reference chain
        // any one of them is from a themeable set
        if (usesReferences(token.original.value)) {
          const refs = getReferences(token.original.value, sd.tokenMap);
          if (refs.some((ref) => isPartOfEnabledSet(ref))) {
            return {
              themeable: true,
            };
          }
        }
      },
    });

    await sd.cleanAllPlatforms();
    await sd.buildAllPlatforms();
  }
}
run();
