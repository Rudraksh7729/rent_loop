import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // `motion.div` member usage is not always detected as a reference
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^(motion|[A-Z_])',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: [
      'src/context/AuthContext.jsx',
      'src/context/ListingContext.jsx',
      'src/context/RentalContext.jsx',
    ],
    rules: {
      // Canonical context modules export both the context object and Provider.
      'react-refresh/only-export-components': 'off',
    },
  },
])
