/**
 * Return a collection of jobs
 *
 * @param {Array} collection
 *
 */

module.exports = (collection = []) => {
  const collectionSorted = collection
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })
    .reverse();

  return collectionSorted;
};
