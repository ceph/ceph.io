/**
 * Remove tags from an array of tags
 *
 * ['string', 'string', 'string' ]
 *
 * @param {Array} tags
 * @param {Array} filterTags
 *
 */

module.exports = (tags, filterTags = []) => {
  // filter tags to lowercase
  const lcFilterTags = filterTags.map(item => item.toLowerCase());

  // tags to lowercase and remove filter tags
  const lcTags = tags
    .map(tag => tag.toLowerCase())
    .filter(tag => !lcFilterTags.includes(tag));

  return lcTags;
};
