const { page } = require('./i18n');
const locales = require('./locales');

module.exports = {
  eleventyNavigation: {
    title: data => data.title,
    // Unique key for page, by way of using URL path
    key: data => data.key || data.page.url,
    parent: data => {
      // Only generate `parent` for pages with URL data
      if (!data.page.url) return null;

      // Get path segments, no empty strings
      const pathSegments = data.page.url.split('/').filter(s => s);

      // Top-level pages (only have single `locale` segment) don't need parents
      const pageLevel = pathSegments.length;
      if (pageLevel <= 1) return null;

      // Omit last segment to get parent URL
      const parentPath = `/${pathSegments.slice(0, -1).join('/')}/`;

      return data.parent || parentPath;
    },
    order: data => data.order || 0,
  },
  translationKey: data => {
    const url = data.page.url;

    // Return everything after the 2nd instance of /
    return url.substring(url.indexOf('/', 2));
  },
};
