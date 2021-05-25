module.exports = (collection, locale = 'en') => {
  return collection.filter(item => {
    return item.data.locale === locale;
  });
};
