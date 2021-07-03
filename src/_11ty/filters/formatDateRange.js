/**
 * Formats a date range in the most concise way based on the locale
 *
 * @param {Date} date
 * @param {Date} end
 * @param {String} locale
 *
 */

const site = require('../../_data/site');
const { defaultLocale } = site;

module.exports = (date, end, locale = defaultLocale) => {
  const endDate = new Date(end || date);

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // Dates should be converted to UTC to avoid off-by-one issues
    // See docs: https://www.11ty.dev/docs/dates/#dates-off-by-one-day
    timeZone: 'UTC',
  }).formatRange(new Date(date), new Date(endDate));
};
