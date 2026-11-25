import { tseslingConfig } from "./core/eslint.config.mjs";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["**/docs/**", "docs/**"] },
  ...tseslingConfig
];
