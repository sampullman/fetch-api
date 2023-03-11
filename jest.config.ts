module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.([t]s)$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.spec.json',
      },
    ],
  },
};
