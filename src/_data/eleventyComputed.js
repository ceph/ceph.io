module.exports = {
  eleventyNavigation: {
    title: data => data.title,
    // Unique key for page, by way of using URL path
    key: data => data.key || data.page.url,
    parent: data => {
      // Only generate `parent` for pages with URL data
      if (!data.page.url) return;

      // Get path segments, no empty strings
      const pathSegments = data.page.url.split('/').filter(s => s);

      // Top-level pages (only have single `locale` segment) don't need parents
      if (pathSegments.length <= 1) return;

      // Omit last segment to get parent URL
      const parentPath = `/${pathSegments.slice(0, -1).join('/')}/`;

      return data.parent || parentPath;
    },
    order: data => data.order || 0,
  },
};
