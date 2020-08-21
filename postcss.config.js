module.exports = ({ env }) => ({
  plugins: [
    require('postcss-normalize'),
    require('postcss-preset-env')({ stage: 1 }), // https://preset-env.cssdb.org/features#stage-1
    // Other plugins...
    env === 'production' ? require('cssnano')({ preset: 'default' }) : null, // How to use conditional plugins/options for prod
  ],
});
