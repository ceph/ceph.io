module.exports = (date, locale = 'en-GB') => {
  // May need to consider `timezone` option (defaults to UTC)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
    // hour: 'numeric',
    // minute: 'numeric'
    // hour12: false,
    // timeZone: 'UTC',
    // timeZoneName: 'short'
  }).format(new Date(date));
};
