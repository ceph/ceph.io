const fs = require('fs');
const lunr = require('lunr');

const distDir = 'dist/en-GB/news/blog';

let data = fs.readFileSync(distDir + '/search.json', 'utf-8');
// let postsIndex;
let postsIndex = JSON.parse(data);

let searchIndex = lunr(function () {
  this.field('title');
  this.field('author');
  this.field('date');
  this.ref('url');
  this.field('content');

  postsIndex.forEach(post => this.add(post));

  // docs.forEach(function (doc, idx) {
  // 	doc.id = idx;
  // 	this.add(doc);
  // }, this);
});

fs.writeFileSync(distDir + '/index.json', JSON.stringify(searchIndex));
