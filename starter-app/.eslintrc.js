/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-restricted-syntax": [
      "error",
      {
        selector: "Literal[value=/^#(?:[0-9a-fA-F]{3}){1,2}(?:[0-9a-fA-F]{2})?$/]",
        message: "Use design tokens (CSS variables or Tailwind utilities) instead of hard-coded hex colors.",
      },
      {
        selector: "Literal[value=/^(?:rgba?|hsla?)\\s*\\((?!\\s*var\\().*$/i]",
        message: "Use design tokens instead of rgb()/hsl() color literals.",
      },
      {
        selector:
          "TemplateLiteral[expressions.length=0] > TemplateElement[value.raw=/^#(?:[0-9a-fA-F]{3}){1,2}(?:[0-9a-fA-F]{2})?$/]",
        message: "Use design tokens instead of hard-coded hex colors.",
      },
    ],
    "react/no-unescaped-entities": "off",
  },
  settings: {
    next: {
      rootDir: ["./"],
    },
  },
}
