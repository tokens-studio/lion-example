import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import nodeResolve from "@rollup/plugin-node-resolve";
import { importAssertionsPlugin } from "rollup-plugin-import-assert";
import { importAssertions } from "acorn-import-assertions";

export default {
  input: "index.html",
  output: { dir: "dist" },
  plugins: [
    nodeResolve(),
    importAssertionsPlugin(),
    // FIXME: This dynamic import vars plugin doesn't seem to play well with import assertions..???
    dynamicImportVars(),
    html(),
  ],
  acornInjectPlugins: [importAssertions],
};
