/**
 *
 * Returns if the date is in the future compared to the build date.
 *
 * Time is reset 00:00 so check is based soley on yyyy/mm
 *
 * @param {Date} date
 *
 */

module.exports = date => {
  const buildDate = new Date().setHours(0, 0, 0, 0);
  const itemDate = new Date(date).setHours(0, 0, 0, 0);

  return itemDate >= buildDate;
};
