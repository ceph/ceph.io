/**
 * Iterates over an array of tags and returns when they match
 * one of the predefined values
 *
 * ['string', 'string', 'string' ]
 *
 * @param {Array} tags
 *
 */

module.exports = tags => {
  // array of tag suffixes
  const tagSuffix = ['blog-post', 'press-release'];

  // object of label text
  const labelText = {
    'blog-post': 'BLOG',
    'press-release': 'PRESS RELEASE',
  };

  // tags to lowercase, strip out the first 3 chars and check includes tag suffix
  const lcTags = tags
    .map(tag => tag.toLowerCase().substr(3))
    .filter(tag => {
      return tagSuffix.some(suffix => tag.includes(suffix));
    });

  return labelText[lcTags];
};
