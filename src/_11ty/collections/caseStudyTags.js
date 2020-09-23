// returns a collection of case study tags in alphabetical order

module.exports = function (collection) {
  // single array of all tags in lowercase
  const allTags = collection
    .getFilteredByGlob('./src/**/case-studies/**/*.md')
    .map(item => {
      const { tags = [] } = item.data;
      return tags;
    })
    .reduce((collectedTags, tags) => {
      return [...collectedTags, ...tags];
    }, [])
    .map(tag => tag.toLowerCase());

  // remove duplicate tags
  const uniqueTags = [...new Set(allTags)];

  // sort alphabetically
  const tagsSorted = uniqueTags.sort((a, b) => {
    return a.localeCompare(b);
  });

  let caseStudyTag = tagsSorted.map(tag => ({
    tag,
  }));

  return caseStudyTag;
};
