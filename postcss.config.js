module.exports = ({ env }) => ({
  plugins: [
    require('postcss-import'),
    require('postcss-normalize'),
    require('postcss-preset-env')({ stage: 1 }), // https://preset-env.cssdb.org/features#stage-1
    // Other plugins...
    require('@fullhuman/postcss-purgecss')({
      content: [
        './src/**/*.html',
        './src/**/*.md',
        './src/**/*.njk',
        './src/**/*.js',
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: { deep: [/^js-/], greedy: [/anchor$/] },
    }),
    env === 'production' ? require('cssnano')({ preset: 'default' }) : null,
  ],
});
