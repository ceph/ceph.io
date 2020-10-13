/**
 * Return a collection with a limited amount of items
 *
 * @param {Array} collection
 * @param {Number} limit
 * 
 */

module.exports = (collection, limit = 0) => {  
  // return collection unaltered if limit equals 0
  if( limit === 0 ) {
    return collection;
  }

  // return collection limited to specific value
  return collection.slice(0, limit);
};