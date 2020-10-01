/**
 * Remove all html elements from string
 *
 * @param {string} text
 *
 */

module.exports = (text = '') => {
  const regexHtml = /(&lt;.*?&gt;)|(<.*?>)/gi;
  return text.replace(regexHtml, '');
};
