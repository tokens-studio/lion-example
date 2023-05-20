import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import nodeResolve from "@rollup/plugin-node-resolve";
import { importAssertions } from "acorn-import-assertions";
import css from "rollup-plugin-import-css";

export default {
  input: "index.html",
  output: { dir: "dist" },
  plugins: [nodeResolve(), css(), dynamicImportVars(), html()],
  acornInjectPlugins: [importAssertions],
};
