import { prettierConfig } from "./core/prettier.config.mjs";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...prettierConfig
};

export default config;
