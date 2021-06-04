/**
 * Iterates over an array of tags and returns when they match
 * one of the predefined values
 *
 * ['string', 'string', 'string' ]
 *
 * @param {Array} tags
 *
 */

module.exports = (tags = []) => {
  // array of tag suffixes
  const tagSuffix = ['blog-post', 'press-release'];

  // tags to lowercase and check includes tag suffix
  const lcTags = tags
    .map(tag => tag.toLowerCase())
    .find(tag => {
      return tagSuffix.some(suffix => tag === suffix);
    });

  return lcTags;
};
