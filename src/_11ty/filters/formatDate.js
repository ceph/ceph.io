const site = require('../../_data/site');
const { defaultLocale } = site;

module.exports = (date, locale = defaultLocale) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // Dates should be converted to UTC to avoid off-by-one issues
    // See docs: https://www.11ty.dev/docs/dates/#dates-off-by-one-day
    timeZone: 'UTC',
  }).format(new Date(date));
};
