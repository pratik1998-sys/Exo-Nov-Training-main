import tseslint from "typescript-eslint";

export const tseslingConfig = [
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error"
    }
  }
];
