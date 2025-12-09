import importAlias from "@dword-design/eslint-plugin-import-alias";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default [
  // Configuration globale pour ignorer certains fichiers
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.yarn/**",
      "release.config.js",
      "documentation/**",
    ],
  },

  // Configuration pour les fichiers .js (sans TypeScript parsing)
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...js.configs.recommended.rules,
      "simple-import-sort/imports": "error",
      "no-extra-semi": "error",
      semi: ["error", "always"],
      "no-trailing-spaces": "error",
    },
  },

  // Configuration de base pour tous les fichiers TS/TSX
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: [
          "tsconfig.json",
          "server/tsconfig.json",
          "shared/tsconfig.json",
          "ui/tsconfig.json",
        ],
        tsconfigRootDir: import.meta.dirname,
        noWarnOnMultipleProjects: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: "readonly",
        JSX: "readonly",
        NodeJS: "readonly",
        echarts: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: react,
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort,
      import: importPlugin,
      "@dword-design/import-alias": importAlias,
      "unused-imports": unusedImports,
    },
    rules: {
      // Règles ESLint de base
      ...js.configs.recommended.rules,

      // Règles TypeScript
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-redeclare": "off",
      "no-redeclare": "off",

      // Règles React
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",

      // Règles React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Règles de formatage
      "max-len": [
        "warn",
        {
          code: 120,
          ignorePattern: "^import\\s.+\\sfrom\\s.+;$",
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      "no-extra-semi": "error",
      semi: ["error", "always"],
      indent: "off",
      "no-prototype-builtins": "error",
      "no-trailing-spaces": "error",

      // Règles d'import
      "simple-import-sort/imports": "error",
      "import/no-cycle": ["error", { ignoreExternal: true }], // Activé en CI
      "import/no-relative-packages": "error",
      "import/no-useless-path-segments": ["error"],
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.test.ts",
            "**/*.test.tsx",
            "**/*.spec.ts",
            "**/tests/**/*.ts",
            "**/tests/*.ts",
            "**/fixtures/**/*.ts",
            "**/tsup.config.ts",
            "**/vitest.workspace.ts",
          ],
        },
      ],
      "import/namespace": "warn",

      // Règles unused-imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: [
            "server/tsconfig.json",
            "shared/tsconfig.json",
            "ui/tsconfig.json",
          ],
        },
      },
    },
  },

  // Configuration spécifique pour les fichiers de test server-side
  // pour désactiver les règles React Hooks qui détectent à tort usePg comme un hook
  {
    files: ["server/**/*.spec.ts", "server/**/*.test.ts"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },
];
