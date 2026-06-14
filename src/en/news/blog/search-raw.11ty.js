const cleanSearchRaw = require('../../../_11ty/filters/cleanSearchRaw');

module.exports = class {
  data() {
    return {
      layout: false,
      permalink: data => `/${data.locale}/news/blog/search-raw.json`,
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections, locale }) {
    const collection = collections[`${locale}-blog-post`] || [];

    const articles = collection.map(item => ({
      title: item.data.title,
      author: item.data.author,
      content: cleanSearchRaw(item.templateContent),
    }));

    return JSON.stringify(articles);
  }
};
