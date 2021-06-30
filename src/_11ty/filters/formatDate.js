const site = require('../../_data/site');
const { defaultLocale } = site;

module.exports = (date, locale = defaultLocale) => {
  // Dates should be set to UTC to avoid off-by-one issues
  // Docs: https://www.11ty.dev/docs/dates/#dates-off-by-one-day
  const dateUTC = new Date(date).toUTCString();

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timezone: 'UTC',
  }).format(new Date(dateUTC));
};
