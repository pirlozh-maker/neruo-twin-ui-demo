module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-refresh/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
};
