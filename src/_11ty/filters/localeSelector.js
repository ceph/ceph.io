module.exports = (collection, locale = 'en-GB') => {
  return collection.filter(item => {
    return item.data.locale === locale;
  });
};
