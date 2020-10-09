const lodashChunk = require('lodash.chunk');

module.exports = function (collection) {
  // return [...collection.getFilteredByGlob('./src/**/blog/**/*.md')].reverse();

  // single array of all tags in lowercase
  const allTags = collection
    .getFilteredByGlob('./src/**/blog/**/*.md')
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

  // Get each item that matches the tag
  let paginationSize = 3;
  let tagMap = [];
  let tagArray = [...uniqueTags];
  for (let tagName of tagArray) {
    let tagItems = collection.getFilteredByTag(tagName);
    let pagedItems = lodashChunk(tagItems, paginationSize);
    // console.log( tagName, tagItems.length, pagedItems.length );
    for (
      let pageNumber = 0, max = pagedItems.length;
      pageNumber < max;
      pageNumber++
    ) {
      tagMap.push({
        tagName: tagName,
        pageNumber: pageNumber,
        pageData: pagedItems[pageNumber],
      });
    }
  }

  console.log(tagMap);
  return tagMap;
};
