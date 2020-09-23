// returns a collection of case studies in reverse date order

module.exports = function (collection) {
  return [
    ...collection.getFilteredByGlob('./src/**/case-studies/**/*.md'),
  ].reverse();
};
