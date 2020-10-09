/**
 * Remove tag from an array tags
 *
 * ['string', 'string', 'string' ]
 *
 * @param {array} tags
 * @param {array} filterTags
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
