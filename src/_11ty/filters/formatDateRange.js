/**
 * Formats a date range in the most concise way based on the locale
 *
 * @param {Date} date
 * @param {Date} end
 * @param {String} locale
 *
 */

module.exports = (date, end, locale = 'en-GB') => {
  const endDate = new Date(end || date);

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).formatRange(date, endDate);
};
