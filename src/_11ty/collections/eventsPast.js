/**
 * Returns a collection of events in date reverse order
 * removing items that are newer than the current date based on month/day
 *
 * Time is reset 00:00 so as not to override the month/day
 *
 * See comment about using .reverse mutation of an array
 * https://www.11ty.dev/docs/collections/
 */

module.exports = function (collectionApi) {
  const currentDate = new Date().setHours(0, 0, 0, 0);

  return collectionApi
    .getFilteredByGlob('./src/**/events/**/*.md')
    .reverse()
    .filter(({ data: { date, end } = {} }) => {
      const endDate = new Date(end || date).setHours(0, 0, 0, 0);
      return endDate < currentDate;
    });
};
