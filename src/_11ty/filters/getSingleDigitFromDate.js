/**
 * "Random" but consistent single-digit numbers from a date
 * https://stackoverflow.com/a/49892742/7000394
 *
 * @param {string} date
 *
 */

const site = require('../../_data/site');
const { defaultLocale } = site;

module.exports = (date = '', locale = defaultLocale) => {
  const newDate = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(date));

  const dateAsNumber = Number(newDate.replace(/\//g, ''));
  return dateAsNumber % 9 || 9;
};
