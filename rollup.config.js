import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const srcDir = `./src/js/`;
const distDir = 'dist/js/';

const pluginsES = () => [
  resolve(),
  commonjs(),
  process.env.NODE_ENV === 'development' && terser(),
];

const pluginsES5 = () => [
  resolve(),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['ie 11'],
          },
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ],
    ],
  }),
  process.env.NODE_ENV === 'production' && terser(),
];

function setupBuild(plugins, src, dist) {
  return {
    input: srcDir + src,
    output: {
      file: distDir + dist,
      format: 'iife',
      sourcemap: process.env.NODE_ENV === 'production' ? false : 'inline',
    },
    plugins: plugins,
  };
}

export default [
  setupBuild(pluginsES(), 'main.js', 'bundle-main.mjs'),
  setupBuild(pluginsES5(), 'main.js', 'bundle-main.js'),
  setupBuild(pluginsES(), 'search.js', 'bundle-search.mjs'),
  setupBuild(pluginsES5(), 'search.js', 'bundle-search.js'),
];
