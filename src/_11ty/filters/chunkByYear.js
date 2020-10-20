/**
 * Accepts a JSON array and splits it into chunks per year
 * and returns as a JS object.
 *
 * @param {JSON array} collection 
 */

module.exports = (collection = []) => {
  // sort all collection items in reverse chronological order
  const collectionSorted = collection.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }).reverse();

  // single array of all years
  const allYears = collectionSorted
    .map(item => {
      const year = item.date.substr(0, 4)
      return year;
    });

  // remove duplicate years
  const uniqueYears = [...new Set(allYears)];

  // set up base chunks object
  /**
   * 'yyyy': {
   *   name: 'yyyy',
   *   results: [] 
   * }
   */
  let chunkedResults = uniqueYears.reduce((acc, cur) => ({ ...acc, [cur]: {
    name: cur,
    results: []
  } }), {});
  
  // throw items into respective year chunk results array
  collectionSorted.forEach(item => {
    const year = item.date.substr(0,4);

    // guardian to check if chunkedResults has a matching year key
    const yearData = chunkedResults[year];    
    if (!yearData) return;

    // guardian to check if chunkedResults year key has an array of results
    const yearResultsData = yearData.results;    
    if (!yearResultsData) return;

    // push items into the chunkedReults year key results array
    chunkedResults[year].results.push(item);
  });

  return chunkedResults;
};
