const fs = require('fs');
const lunr = require('lunr');

const locales = require('../src/_data/locales');

function getData(distDir) {
  let data = fs.readFileSync(distDir + '/search-raw.json', 'utf-8');
  return JSON.parse(data);
}

function buildIndex(articles) {
  let searchIndex = lunr(function () {
    this.ref('id');
    this.field('title');
    this.field('author');
    this.field('date');
    this.field('content');

    articles.forEach(function (article, searchIndex) {
      article.id = searchIndex;
      this.add(article);
    }, this);
  });

  return searchIndex;
}

function writeData(distDir, searchIndex) {
  fs.writeFileSync(distDir + '/search-index.json', JSON.stringify(searchIndex));
}

locales.forEach(locale => {
  const distDir = `dist/${locale.code}/news/blog`;

  const data = getData(distDir);

  const searchIndex = buildIndex(data);

  writeData(distDir, searchIndex);
});
