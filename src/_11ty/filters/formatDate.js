const site = require('../../_data/site');
const { defaultLocale } = site;

module.exports = (date, locale = defaultLocale) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(new Date(date).toUTCString()));
  return format;
};
