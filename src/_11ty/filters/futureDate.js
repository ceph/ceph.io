/**
 * Remove items that are older or not equal to the current date based on month/day
 * returning a collection of future items
 *
 * Time is reset 00:00 so as not to override the month/day
 *
 * @param {Array} collection
 */

module.exports = collection => {
  const currentDate = new Date().setHours(0, 0, 0, 0);

  return collection.filter(item => {
    const formattedDate = new Date(item.data.date).setHours(0, 0, 0, 0);
    return formattedDate >= currentDate;
  });
};
