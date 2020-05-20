module.exports = function (eleventyConfig) {
  // Filters
  eleventyConfig.addFilter('formatDate', (date, locale = 'en-GB') => {
    // We'll want to consider locales here based on multi-lingual content?
    // May need to consider `timezone` option (defaults to UTC)
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  });

  // Layout aliases
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk'); // We probably won't use base directly, but until we have page-level templates...
  eleventyConfig.addLayoutAlias('article', 'layouts/article.njk');

  // Transforms

  // Passthrough copy

  // Plugins

  // Browsersync
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        // Dev mode redirect for root path
        bs.addMiddleware('*', (req, res) => {
          if (req.url === '/') {
            res.writeHead(302, {
              location: '/en/'
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
