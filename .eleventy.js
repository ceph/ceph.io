const fs = require('fs');

// Collections
const blogPosts = require('./src/_11ty/collections/blogPosts.js');
const blogTags = require('./src/_11ty/collections/blogTags.js');
const caseStudies = require('./src/_11ty/collections/caseStudies.js');
const caseStudyTags = require('./src/_11ty/collections/caseStudyTags.js');
const primary = require('./src/_11ty/collections/primary.js');

// Filters
const formatDate = require('./src/_11ty/filters/formatDate.js');
const startsWith = require('./src/_11ty/filters/startsWith.js');
const localeSelector = require('./src/_11ty/filters/localeSelector.js');
const squash = require('./src/_11ty/filters/squash.js');

// Plugins
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const i18n = require('eleventy-plugin-i18n');
const translations = require('./src/_data/i18n');

module.exports = function (eleventyConfig) {
  console.log(process.env.NODE_ENV);

  // Hot-reload site on CSS changes
  eleventyConfig.addWatchTarget('src/css');

  // Collections
  eleventyConfig.addCollection('blogPosts', blogPosts);
  eleventyConfig.addCollection('blogTags', blogTags);
  eleventyConfig.addCollection('caseStudies', caseStudies);
  eleventyConfig.addCollection('caseStudyTags', caseStudyTags);
  eleventyConfig.addCollection('primary', primary);

  // Filters
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('startsWith', startsWith);
  eleventyConfig.addFilter('localeSelector', localeSelector);
  eleventyConfig.addFilter('squash', squash);

  // Layout aliases — TBC if this is bringing enough benefit
  eleventyConfig.addLayoutAlias('base', 'layouts/_base.njk');
  eleventyConfig.addLayoutAlias('article', 'layouts/article.njk');
  eleventyConfig.addLayoutAlias('case-study', 'layouts/case-study.njk');
  eleventyConfig.addLayoutAlias('content', 'layouts/content.njk');
  eleventyConfig.addLayoutAlias('event', 'layouts/event.njk');
  eleventyConfig.addLayoutAlias('home', 'layouts/home.njk');
  eleventyConfig.addLayoutAlias('hub-community', 'layouts/hub-community.njk');
  eleventyConfig.addLayoutAlias('hub-developers', 'layouts/hub-developers.njk');
  eleventyConfig.addLayoutAlias('hub-discover', 'layouts/hub-discover.njk');
  eleventyConfig.addLayoutAlias('hub-foundation', 'layouts/hub-foundation.njk');
  eleventyConfig.addLayoutAlias('hub-news', 'layouts/hub-news.njk');
  eleventyConfig.addLayoutAlias('hub-solutions', 'layouts/hub-solutions.njk');
  eleventyConfig.addLayoutAlias(
    'listing-blog-posts',
    'layouts/listing-blog-posts.njk'
  );
  eleventyConfig.addLayoutAlias(
    'listing-blog-tags',
    'layouts/listing-blog-tags.njk'
  );
  eleventyConfig.addLayoutAlias(
    'listing-case-studies',
    'layouts/listing-case-studies.njk'
  );
  eleventyConfig.addLayoutAlias(
    'listing-case-study-tags',
    'layouts/listing-case-study-tags.njk'
  );
  eleventyConfig.addLayoutAlias('listing-events', 'layouts/listing-events.njk');
  eleventyConfig.addLayoutAlias(
    'listing-planet-ceph-articles',
    'layouts/listing-planet-ceph-articles.njk'
  );
  eleventyConfig.addLayoutAlias(
    'listing-press-releases',
    'layouts/listing-press-releases.njk'
  );

  // Transforms

  // Passthrough copy
  eleventyConfig.addPassthroughCopy('src/js');

  // Plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'en-GB',
    },
  });

  // Browsersync
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', (req, res) => {
          // Dev mode redirect for root path to default language
          if (req.url === '/') {
            res.writeHead(302, {
              location: '/en-GB/',
            });
            res.end();
          }

          // 404 on --serve
          // https://www.11ty.dev/docs/quicktips/not-found/#with-serve
          const content_404 = fs.readFileSync('dist/404.html');
          res.write(content_404);
          res.writeHead(404);
          res.end();
        });
      },
    },
  });

  // Configuration
  eleventyConfig.setDataDeepMerge(true);
  // TBC if this is a bit heavy-handed
  // See https://www.11ty.dev/docs/data-deep-merge/

  return {
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
