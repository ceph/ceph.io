// returns the primary navigation items of a collection

module.exports = function (collection) {
  return collection.filter(item => {
    const { tags = [] } = item.data;

    const excludeTags = ['support', 'error'];

    return !tags.some(tag => excludeTags.includes(tag));
  });
};
