import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

const pkg = require('./package.json');

export default [
  {
    input: 'lib/index.ts',
    output: [
      {
        exports: 'named',
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        exports: 'named',
        file: pkg.module,
        sourcemap: true,
      },
    ],
    external: Object.keys(pkg.devDependencies),
    plugins: [typescript(), commonjs(), resolve(), sourceMaps()],
  },
  {
    input: './dist/lib/index.d.ts',
    output: [{ file: 'dist/fetch-api.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
