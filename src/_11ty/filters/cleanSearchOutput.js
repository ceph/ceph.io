/**
 * Clean search output data so it's more efficient
 *
 * @param {String} text
 */

module.exports = function (text) {
  var content = new String(text);

  // remove all html elements and new lines
  var html = /(&lt;.*?&gt;)|(<.*?>)/gi;
  var plain = unescape(content.replace(html, ''));

  // remove unicode characters
  var unicode = /[\u0000-\u001F\u007F-\u009F]/g;
  result = plain.replace(unicode, '');

  // remove punctuation
  var punctuation = /[#$%&()*+,-./\\:;<=>@[\]^_`{|}~]/g;
  result = result.replace(punctuation, '');

  // replace line breaks
  var lineBreaks = /[\r\n]+/gm;
  result = result.replace(lineBreaks, ' ');

  // replace extra spaces
  var extraSpaces = /\s+/g;
  result = result.replace(extraSpaces, ' ');

  return result;
};
