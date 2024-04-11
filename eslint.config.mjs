// @ts-check

import eslint from '@eslint/js';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier';
import tslint from 'typescript-eslint';

export default tslint.config(
  {
    ignores: ['tools/**', '**/dist/**', '**/example/**'],
  },
  eslint.configs.recommended,
  ...tslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig-eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { jest, prettier },
    rules: {
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
    },
  },
);
