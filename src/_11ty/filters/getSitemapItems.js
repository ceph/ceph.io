// returns the pages of a collection with their language variants

module.exports = function (collection) {
  return collection.map((item, index, all) => {
    return {
      url: item.url,
      date: item.date,
      data: {
        ...item.data,
        sitemap: {
          ...item.data.sitemap,
          links: all
            // Find all the translations of the current item.
            // This assumes that all translated items that belong together
            // have the same `translationKey` value in the front matter.
            .filter(other => {
              return other.data.translationKey === item.data.translationKey;
            })

            // Map each translation into an alternate link. See https://github.com/ekalinin/sitemap.js/blob/master/api.md#ILinkItem
            // Here we assume each item has a `lang` value in the front
            // matter. See https://support.google.com/webmasters/answer/189077#language-codes
            .map(translation => {
              return {
                url: translation.url,
                lang: translation.data.locale,
              };
            }),
        },
      },
    };
  });
};
