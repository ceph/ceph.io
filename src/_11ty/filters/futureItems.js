/**
 * 
 * Return items that are in the future compared to the build date.
 *
 * Time is reset 00:00 so check is based soley on yyyy/mm
 *
 * @param {Array} collection
 * 
 */

module.exports = collection => {
  const buildDate = new Date().setHours(0, 0, 0, 0);

  return collection.filter(item => {
    const formattedDate = new Date(item.data.date).setHours(0, 0, 0, 0);
    return formattedDate >= buildDate;
  });
};
