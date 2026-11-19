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
      // Keep sanitize.css rules such as `:where(nav) :where(ol, ul)`: without
      // ':where' here, purgecss drops a selector made only of :where() groups
      // (FullHuman/purgecss#978). The selectors inside :where() are still
      // checked against the content.
      safelist: { standard: [':where'], deep: [/^js-/], greedy: [/anchor$/] },
    }),
    env === 'production' ? require('cssnano')({ preset: 'default' }) : null,
  ],
});
