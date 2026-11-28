const cleanCardContent = require('../../../_11ty/filters/cleanCardContent');
const truncate = require('../../../_11ty/filters/truncate');

module.exports = class {
  data() {
    return {
      layout: false,
      permalink: data => `/${data.locale}/news/blog/search-output.json`,
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections, locale }) {
    const collection = collections[`${locale}-blog-post`] || [];

    const articles = collection.map(item => ({
      image: item.data.image || '',
      title: item.data.title,
      author: item.data.author,
      date: item.data.date,
      url: item.url,
      content: truncate(cleanCardContent(item.templateContent)),
    }));

    return JSON.stringify(articles);
  }
};
