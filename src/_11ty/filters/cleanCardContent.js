/**
 * Clean template content
 *
 * @param {String} text
 */

module.exports = function (text) {
  var content = new String(text);

  // remove all html elements and new lines
  var html = /(&lt;.*?&gt;)|(<.*?>)/gi;
  var result = unescape(content.replace(html, ''));

  const unicode = /[\u0000-\u001F\u007F-\u009F]/g;
  const punctuation = /[#$%()*+/\\<=>@[\]^_`{|}~¶]/g;
  const extraSpaces = /\s+/g;

  // collapse whitespace first; the unicode range also matches \t\r\n
  return result
    .replace(extraSpaces, ' ')
    .replace(unicode, '')
    .replace(punctuation, '')
    .replace(extraSpaces, ' ');
};
