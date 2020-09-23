// returns a collection of blog posts in reverse date order

module.exports = function (collection) {
  return [...collection.getFilteredByGlob('./src/**/blog/**/*.md')].reverse();
};
