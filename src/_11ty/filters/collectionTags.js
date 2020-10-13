/**
 * Returns all tags from a specific collection flattened
 * into an single array keyed with only strings
 *
 * It removes any duplicate tags and sorts them alphabetically
 *
 * It provides an optional tags value to remove tag/s
 *
 * ['string', 'string', 'string' ]
 *
 * @param {Array} collection
 * @param {Array} filterTags
 *
 */

module.exports = (collection, filterTags = []) => {
  // filter tags to lowercase
  const lcFilterTags = filterTags.map(item => item.toLowerCase());

  // single array of all tags in lowercase
  const allTags = collection
    .map(item => {
      const { tags = [] } = item.data;
      return tags;
    })
    .reduce((collectedTags, tags) => {
      return [...collectedTags, ...tags];
    }, [])
    .map(tag => tag.toLowerCase())
    .filter(tag => !lcFilterTags.includes(tag));

  // remove duplicate tags
  const uniqueTags = [...new Set(allTags)];

  // sort alphabetically
  const tagsSorted = uniqueTags.sort((a, b) => {
    return a.localeCompare(b);
  });

  return tagsSorted;
};
