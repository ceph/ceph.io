/**
 * Truncates text to a specific length and appends ...
 *
 * @param {string} text
 * @param {number} length
 * @param {string} append
 *
 */

module.exports = (text = '', length = 100, append = '…') => {
  /* Return unchanged if not long enough */
  if (text.length <= length) return text;

  /* Otherwise truncate and lop off trailing orphan */
  const truncatedText = text.substr(0, length);
  const cleanText = truncatedText.substring(0, truncatedText.lastIndexOf(' '));

  /* Tidy and append chars */
  return cleanText.trim() + append;
};
