import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const env = process.env.NODE_ENV;

const babelConfig = {
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
};

const terserConfig = {
  ecma: 2018,
  mangle: { toplevel: true },
  compress: {
    module: true,
    toplevel: true,
    unsafe_arrows: true,
    drop_console: !env,
    drop_debugger: !env,
  },
  output: { quote_style: 1 },
};

export default [
  // Main bundle used on every page
  {
    input: 'src/js/main.js',

    plugins: [
      commonjs(),
      resolve({
        browser: true,
      }),
      babel(babelConfig),
    ],

    output: {
      file: 'dist/js/bundle-main.js',
      format: 'iife',
      plugins: [terser(terserConfig)],
    },
  },
  // Search bundle used only for blog search
  {
    input: 'src/js/search.js',

    plugins: [
      commonjs(),
      resolve({
        browser: true,
      }),
      babel(babelConfig),
    ],

    output: {
      file: 'dist/js/bundle-search.js',
      format: 'iife',
      plugins: [terser(terserConfig)],
    },
  },
];
