// returns a collection of press releases in reverse date order

module.exports = function (collection) {
  return [
    ...collection.getFilteredByGlob('./src/**/press-releases/**/*.md'),
  ].reverse();
};
