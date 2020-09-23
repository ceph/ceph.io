// returns a collection of primary navigation items

module.exports = function (collectionApi) {
  return collectionApi.getAll().filter(item => {
    const { tags = [] } = item.data;
    return !tags.includes('support');
  });
};
