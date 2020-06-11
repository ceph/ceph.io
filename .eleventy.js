const formatDate = require('./src/_11ty/filters/formatDate.js');

const i18n = require('eleventy-plugin-i18n');
const translations = require('./src/_data/i18n');

module.exports = function (eleventyConfig) {
  // Filters
  eleventyConfig.addFilter('formatDate', formatDate);

  // Layout aliases
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk'); // We probably won't use base directly, but until we have page-level templates...
  eleventyConfig.addLayoutAlias('article', 'layouts/article.njk');

  // Transforms

  // Passthrough copy

  // Plugins
  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'en-GB'
    }
  });

  // Browsersync
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        // Dev mode redirect for root path
        bs.addMiddleware('*', (req, res) => {
          if (req.url === '/') {
            res.writeHead(302, {
              location: '/en-GB/'
            });
            res.end();
          }
        });
      }
    }
  });

  // Configuration
  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};
