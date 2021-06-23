const chalk = require('chalk');
const fs = require('fs');
const lunr = require('lunr');

const locales = require('../src/_data/locales');

function getData(distDir) {
  try {
    let data = fs.readFileSync(distDir + '/search-raw.json', 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.log(chalk.red(`Error building search index: ${e.toString()}`));
    process.exit(1);
  }
}

function buildIndex(articles = []) {
  const searchIndex = lunr(function () {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('author', { boost: 5 });
    this.field('content');

    articles.forEach((article, searchIndex) => {
      article.id = searchIndex;
      this.add(article);
    });
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
