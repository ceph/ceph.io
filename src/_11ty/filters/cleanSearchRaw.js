/**
 * Clean raw search data so it's more efficient
 *
 * @param {String} text
 */

 module.exports = function (text) {
  // all lower case
  var content = new String(text);
  var content = content.toLowerCase();

  // remove all html elements and new lines
  var html = /(&lt;.*?&gt;)|(<.*?>)/gi;
  var plain = unescape(content.replace(html, ''));

  // remove duplicated words
  var words = plain.split(' ');
  var deduped = [...new Set(words)];
  var dedupedStr = deduped.join(' ');

  // remove short and less meaningful words
  var shortWords = /\b(the|a|an|and|am|you|I|to|if|of|off|me|my|on|in|it|is|at|as|we|do|be|has|but|was|so|no|not|or|up|for|ve|ll|re|s)\b/gi;
  var result = dedupedStr.replace(shortWords, '');

  // remove unicode characters
  var unicode = /[\u0000-\u001F\u007F-\u009F]/g;
  result = result.replace(unicode, '');

  // remove punctuation
  var punctuation = /[!“”‘’"#$%&'()*+,-./\\:;<=>?@[\]^_–`{|}~]/g;
  result = result.replace(punctuation, '');

  // replace line breaks
  var lineBreaks = /[\r\n]+/gm;
  result = result.replace(lineBreaks, ' ');

  // replace extra spaces
  var extraSpaces = /\s+/g;
  result = result.replace(extraSpaces, ' ');

  return result;
};
