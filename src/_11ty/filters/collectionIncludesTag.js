/**
 * Checks a collections tags to see if it contains a specific
 * tag and returns the collection if true
 *
 * @param {object} collection
 * @param {string} filterTag
 *
 */

module.exports = (collection, filterTag = '') => {
  // filter tag to lowercase
  const lcFilterTag = filterTag.toLowerCase();  

  // collection tags to lowercase and check includes filter tag
  return collection.filter(item => {
    const allTags = item.data.tags
      .map(tag => tag.toLowerCase());
    return allTags.includes(lcFilterTag);
  })  
};
