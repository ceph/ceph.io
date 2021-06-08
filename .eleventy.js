const fs = require('fs');

// Plugins
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const sitemap = require('@quasibit/eleventy-plugin-sitemap');
const i18n = require('eleventy-plugin-i18n');
const translations = require('./src/_data/i18n');

module.exports = function (eleventyConfig) {
  console.log(process.env.NODE_ENV);

  // Hot-reload site on CSS changes
  eleventyConfig.addWatchTarget('src/css');
  eleventyConfig.addWatchTarget('src/_11ty');

  // Collections
  const collectionsDir = `./src/_11ty/collections`;
  eleventyConfig.addCollection('primary', require(`${collectionsDir}/primary.js`));
  eleventyConfig.addCollection('sitemap', require(`${collectionsDir}/sitemap.js`));

  // Filters
  const filtersDir = `./src/_11ty/filters`;
  eleventyConfig.addFilter('chunkByYear', require(`${filtersDir}/chunkByYear.js`));
  eleventyConfig.addFilter('cleanIndex', require(`${filtersDir}/cleanIndex.js`));
  eleventyConfig.addFilter('endsWith', require(`${filtersDir}/endsWith.js`));
  eleventyConfig.addFilter('formatDate', require(`${filtersDir}/formatDate.js`));
  eleventyConfig.addFilter('formatDateRange', require(`${filtersDir}/formatDateRange.js`));
  eleventyConfig.addFilter('getArticleType', require(`${filtersDir}/getArticleType.js`));
  eleventyConfig.addFilter('getCollectionByTag', require(`${filtersDir}/getCollectionByTag.js`));
  eleventyConfig.addFilter('getCollectionTags', require(`${filtersDir}/getCollectionTags.js`));
  eleventyConfig.addFilter('getItems', require(`${filtersDir}/getItems.js`));
  eleventyConfig.addFilter('getItemsByLocale', require(`${filtersDir}/getItemsByLocale.js`));
  eleventyConfig.addFilter('getItemsInFuture', require(`${filtersDir}/getItemsInFuture.js`));
  eleventyConfig.addFilter('getItemsInPast', require(`${filtersDir}/getItemsInPast.js`));
  eleventyConfig.addFilter('isInFuture', require(`${filtersDir}/isInFuture.js`));
  eleventyConfig.addFilter('objectValues', require(`${filtersDir}/objectValues.js`));
  eleventyConfig.addFilter('randomize', require(`${filtersDir}/randomize.js`));
  eleventyConfig.addFilter('removeHtml', require(`${filtersDir}/removeHtml.js`));
  eleventyConfig.addFilter('removeTags', require(`${filtersDir}/removeTags.js`));
  eleventyConfig.addFilter('startsWith', require(`${filtersDir}/startsWith.js`));
  eleventyConfig.addFilter('truncate', require(`${filtersDir}/truncate.js`));

  // Layout aliases — TBC if this is bringing enough benefit
  eleventyConfig.addLayoutAlias('base', 'layouts/_base.njk');
  eleventyConfig.addLayoutAlias('blog-post', 'layouts/blog-post.njk');
  eleventyConfig.addLayoutAlias('case-study', 'layouts/case-study.njk');
  eleventyConfig.addLayoutAlias('content', 'layouts/content.njk');
  eleventyConfig.addLayoutAlias('content-simple', 'layouts/content-simple.njk');
  eleventyConfig.addLayoutAlias('content-support', 'layouts/content-support.njk');
  eleventyConfig.addLayoutAlias('event', 'layouts/event.njk');
  eleventyConfig.addLayoutAlias('home', 'layouts/home.njk');
  eleventyConfig.addLayoutAlias('press-release', 'layouts/press-release.njk');
  eleventyConfig.addLayoutAlias('hub-community', 'layouts/hub-community.njk');
  eleventyConfig.addLayoutAlias('hub-developers', 'layouts/hub-developers.njk');
  eleventyConfig.addLayoutAlias('hub-discover', 'layouts/hub-discover.njk');
  eleventyConfig.addLayoutAlias('hub-foundation', 'layouts/hub-foundation.njk');
  eleventyConfig.addLayoutAlias('hub-news', 'layouts/hub-news.njk');
  eleventyConfig.addLayoutAlias('hub-users', 'layouts/hub-users.njk');
  eleventyConfig.addLayoutAlias('listing-blog-posts', 'layouts/listing-blog-posts.njk');
  eleventyConfig.addLayoutAlias('listing-blog-post-categories', 'layouts/listing-blog-post-categories.njk');
  eleventyConfig.addLayoutAlias('listing-blog-search', 'layouts/listing-blog-search.njk');
  eleventyConfig.addLayoutAlias('listing-case-studies', 'layouts/listing-case-studies.njk');
  eleventyConfig.addLayoutAlias('listing-case-study-categories', 'layouts/listing-case-study-categories.njk');
  eleventyConfig.addLayoutAlias('listing-events', 'layouts/listing-events.njk');
  eleventyConfig.addLayoutAlias('listing-event-categories', 'layouts/listing-event-categories.njk');
  eleventyConfig.addLayoutAlias('listing-planet-ceph-articles', 'layouts/listing-planet-ceph-articles.njk');
  eleventyConfig.addLayoutAlias('listing-press-releases', 'layouts/listing-press-releases.njk');
  eleventyConfig.addLayoutAlias('listing-press-release-categories', 'layouts/listing-press-release-categories.njk');
  eleventyConfig.addLayoutAlias('navigation', 'layouts/navigation.njk');

  // Shortcodes
  const shortcodesDir = `./src/_11ty/shortcodes`;
  eleventyConfig.addShortcode('ArticleCard', require(`${shortcodesDir}/ArticleCard.js`));

  // Transforms

  // Passthrough copy

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
      hostname: 'https://ceph.io',
    },
  });

  // Run after the build ends
  eleventyConfig.on('afterBuild', () => {
    require('./scripts/search-index.js');
  });

  // Browsersync
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', (req, res) => {
          // Dev mode redirect for root path to default language
          if (req.url === '/') {
            res.writeHead(302, {
              location: '/en/',
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
