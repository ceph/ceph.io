/**
 * Remove all html elements from string
 *
 * @param {String} text
 *
 */

module.exports = (text = '') => {
  const regexHtml = /(&lt;.*?&gt;)|(<.*?>)/gi;
  return text.replace(regexHtml, '');
};
