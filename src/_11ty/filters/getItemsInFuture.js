/**
 *
 * Return items that are in the future compared to the build date.
 *
 * Time is reset 00:00 so check is based soley on yyyy/mm
 *
 * @param {Array} collection
 *
 */

module.exports = (collection = []) => {
  const buildDate = new Date().setHours(0, 0, 0, 0);

  const filtered = collection.filter(item => {
    const formattedDate = new Date(item.data.date).setHours(0, 0, 0, 0);

    return formattedDate >= buildDate;
  });

  const sorted = filtered.sort(
    (a, b) => new Date(a.data.date) - new Date(b.data.date)
  );

  return sorted;
};
