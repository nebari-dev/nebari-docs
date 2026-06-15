import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import _import from "eslint-plugin-import";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/dist",
        "**/node_modules",
        "**/.eslintrc.js",
        "**/jest.config.js",
        "**/jest.config.base.js",
        "**/scripts/",
        "**/examples/",
        "**/build",
        "**/.docusaurus",
        "**/docusaurus.config.ts",
        "**/typings",
    ],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "airbnb",
    "airbnb/hooks",
    "plugin:import/errors",
    "plugin:jsx-a11y/recommended",
    "prettier",
)), {
    files: ["**/*.{js,jsx,ts,tsx}"],

    plugins: {
        import: fixupPluginRules(_import),
        "jsx-a11y": fixupPluginRules(jsxA11Y),
        "@typescript-eslint": tsPlugin,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "react/prop-types": 0,
        "jsx-a11y/label-has-for": 0,
        "no-console": 1,
        "react/react-in-jsx-scope": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],

        "react/jsx-filename-extension": [1, {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        }],

        "react/display-name": 1,
    },
}];
