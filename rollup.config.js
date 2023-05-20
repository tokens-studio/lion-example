import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import nodeResolve from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";

export default {
  input: "index.html",
  output: { dir: "dist" },
  plugins: [
    nodeResolve(),
    // see https://github.com/rollup/plugins/issues/1503
    // if we put modules to true, we force CSSStyleSheet (rather than CSS String)
    // Once the issue above is solved, the use of this option can be removed
    css({ modules: true }),
    dynamicImportVars(),
    html(),
  ],
};
