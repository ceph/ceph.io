const site = require('../../_data/site');
const { defaultLocale } = site;

module.exports = (date, locale = defaultLocale) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // Dates should be set to UTC to avoid off-by-one issues
    // Docs: https://www.11ty.dev/docs/dates/#dates-off-by-one-day
  }).format(new Date(date).setHours(0, 0, 0));
};
