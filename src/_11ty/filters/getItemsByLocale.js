const site = require('../../_data/site');
const { defaultLocale } = site;

module.exports = (collection, locale = defaultLocale) => {
  return collection.filter(item => {
    return item.data.locale === locale;
  });
};
