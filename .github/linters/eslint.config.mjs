import jest from 'eslint-plugin-jest'
import globals from 'globals'
import babelParser from '@babel/eslint-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: ['node_modules/', 'dist/', 'coverage/', '*.json']
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:github/recommended',
    'plugin:jest/recommended'
  ),
  {
    plugins: {
      jest
    },

    languageOptions: {
      globals: {
        ...globals.commonjs,
        ...globals.jest,
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      },

      parser: babelParser,
      ecmaVersion: 2023,
      sourceType: 'module',

      parserOptions: {
        requireConfigFile: false,

        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['jest']
        }
      }
    },

    rules: {
      'filenames/match-regex': 'off',
      camelcase: 'off',
      'eslint-comments/no-use': 'off',
      'eslint-comments/no-unused-disable': 'off',
      'i18n-text/no-en': 'off',
      'import/no-commonjs': 'off',
      'import/no-namespace': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      'prettier/prettier': 'error',
      semi: 'off'
    }
  }
]
