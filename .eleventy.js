const fs = require('fs');
const path = require('path');

// Plugins
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const build = require('./src/_data/build') || {};
const i18n = require('eleventy-plugin-i18n');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const sitemap = require('@quasibit/eleventy-plugin-sitemap');
const translations = require('./src/_data/i18n');

module.exports = function (eleventyConfig) {
  console.log(`Running in environment: ${process.env.NODE_ENV || 'development'}`);

  // Hot-reload site on CSS changes
  eleventyConfig.addWatchTarget('src/css');
  eleventyConfig.addWatchTarget('src/_11ty');

  // Helper function to check if a file exists before requiring it
  const requireIfExists = filePath => {
    if (!fs.existsSync(filePath)) {
      console.warn(`Missing file: ${filePath}`);
    }
    return fs.existsSync(filePath) ? require(filePath) : () => {};
  };

  // Collections
  const collectionsDir = './src/_11ty/collections';
  eleventyConfig.addCollection('primary', requireIfExists(`${collectionsDir}/primary.js`));
  eleventyConfig.addCollection('sitemap', requireIfExists(`${collectionsDir}/sitemap.js`));

  // Filters
  const filtersDir = './src/_11ty/filters';
  const filterFiles = [
    'chunkByYear',
    'cleanCardContent',
    'cleanSearchRaw',
    'endsWith',
    'formatDate',
    'formatDateRange',
    'getArticleType',
    'getCollectionByTag',
    'getCollectionTags',
    'getItems',
    'getItemsByLocale',
    'getItemsInFuture',
    'getItemsInPast',
    'getJobs',
    'getSingleDigitFromDate',
    'isInFuture',
    'objectValues',
    'randomize',
    'removeHtml',
    'removeTags',
    'startsWith',
    'truncate',
  ];

  filterFiles.forEach(filter => {
    eleventyConfig.addFilter(filter, requireIfExists(`${filtersDir}/${filter}.js`));
  });

  // Layout aliases
  const layoutAliases = {
    base: 'layouts/_base.njk',
    'blog-post': 'layouts/blog-post.njk',
    'case-study': 'layouts/case-study.njk',
    content: 'layouts/content.njk',
    'content-simple': 'layouts/content-simple.njk',
    'content-support': 'layouts/content-support.njk',
    event: 'layouts/event.njk',
    home: 'layouts/home.njk',
    'press-release': 'layouts/press-release.njk',
    'hub-community': 'layouts/hub-community.njk',
    'hub-developers': 'layouts/hub-developers.njk',
    'hub-discover': 'layouts/hub-discover.njk',
    'hub-foundation': 'layouts/hub-foundation.njk',
    'hub-news': 'layouts/hub-news.njk',
    'hub-users': 'layouts/hub-users.njk',
    'listing-blog-posts': 'layouts/listing-blog-posts.njk',
    'listing-blog-post-categories': 'layouts/listing-blog-post-categories.njk',
    'listing-blog-search': 'layouts/listing-blog-search.njk',
    'listing-case-studies': 'layouts/listing-case-studies.njk',
    'listing-case-study-categories': 'layouts/listing-case-study-categories.njk',
    'listing-events': 'layouts/listing-events.njk',
    'listing-event-categories': 'layouts/listing-event-categories.njk',
    'listing-planet-ceph-articles': 'layouts/listing-planet-ceph-articles.njk',
    'listing-press-releases': 'layouts/listing-press-releases.njk',
    'listing-press-release-categories': 'layouts/listing-press-release-categories.njk',
    navigation: 'layouts/navigation.njk',
  };

  Object.entries(layoutAliases).forEach(([alias, layoutPath]) => {
    const fullPath = path.join(__dirname, 'src/_includes', layoutPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`Missing layout: ${layoutPath}`);
    }
    eleventyConfig.addLayoutAlias(alias, layoutPath);
  });

  // Shortcodes
  const shortcodesDir = './src/_11ty/shortcodes';
  eleventyConfig.addShortcode('ArticleCard', requireIfExists(`${shortcodesDir}/ArticleCard.js`));
  eleventyConfig.addShortcode('YouTube', requireIfExists(`${shortcodesDir}/YouTube.js`));

  // Transforms
  const transformsDir = './src/_11ty/transforms';
  eleventyConfig.addTransform('htmlmin', requireIfExists(`${transformsDir}/html-minifier.js`));

  // Passthrough copy
  eleventyConfig.addPassthroughCopy('./src/assets/**/*.json');
  eleventyConfig.addPassthroughCopy('./src/**/*.{csv,pdf,ods}');

  // Plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'en',
    },
  });
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: build && build.isProduction ? 'https://ceph.io' : 'https://develop.ceph.io',
    },
  });

  // Markdown overrides
  let markdownLibrary = markdownIt({
    html: true,
    linkify: true,
  }).use(markdownItAnchor, {
    level: [2, 3, 4, 5, 6],
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '🔗',
    space: true,
  });

  eleventyConfig.setLibrary('md', markdownLibrary);

  // Run after the build ends
  eleventyConfig.on('afterBuild', () => {
    const searchIndexPath = './scripts/search-index.js';
    if (fs.existsSync(searchIndexPath)) {
      require(searchIndexPath);
    } else {
      console.warn('Warning: search-index.js not found, skipping post-build task.');
    }
  });

  eleventyConfig.setServerOptions({
    module: '@11ty/eleventy-server-browsersync',
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', (req, res) => {
          if (req.url === '/') {
            res.writeHead(302, { location: '/en/' });
            res.end();
          } else {
            const errorPagePath = path.join(__dirname, 'src/en/404.html');
            if (fs.existsSync(errorPagePath)) {
              const content_404 = fs.readFileSync(errorPagePath);
              res.writeHead(404);
              res.end(content_404);
            } else {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('404 Not Found');
            }
          }
        });
      },
    },
  });

  // Configuration
  eleventyConfig.setDataDeepMerge(true);

  return {
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
