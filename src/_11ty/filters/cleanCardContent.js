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
  const lineBreaks = /[\r\n]+/gm;
  const extraSpaces = /\s+/g;

  return result
    .replace(unicode, '')
    .replace(punctuation, '')
    .replace(lineBreaks, ' ')
    .replace(extraSpaces, ' ');
};
