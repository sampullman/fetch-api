module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  transform: {
    '^.+\\.(ts)$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: [],
  testEnvironment: 'jsdom',
};
