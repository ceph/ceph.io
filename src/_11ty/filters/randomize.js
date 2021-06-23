/**
 * Return a collection in random order
 *
 * @param {Array} collection
 *
 */

module.exports = (collection = []) => {
  let counter = collection.length;

  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);

    // Subtracts one from itself and returns a value
    counter--;

    const temp = collection[counter];

    // Swap the last element with the random one
    collection[counter] = collection[index];
    collection[index] = temp;
  }

  return collection;
};
