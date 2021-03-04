import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const env = process.env.NODE_ENV;

export default {
  input: 'src/js/main.js',

  watch: {
    include: 'src/js',
    clearScreen: false,
  },

  plugins: [
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
    }),
    resolve({
      browser: true,
    }),
    commonjs(),
  ],

  output: {
    file: 'dist/js/bundle.js',
    format: 'es',
    plugins: [
      terser({
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
      }),
    ],
  },
};
