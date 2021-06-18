/**
 * Clean raw search data so it's more efficient
 *
 * @param {String} text
 */

module.exports = function (text) {
  const content = new String(text).toLowerCase();

  // remove all html elements and new lines
  const html = /(&lt;.*?&gt;)|(<.*?>)/gi;
  const plain = unescape(content.replace(html, ''));

  // remove duplicated words
  const words = plain.split(' ');
  const deduped = [...new Set(words)];
  const result = deduped.join(' ');

  const shortWords =
    /\b(the|a|an|and|am|you|I|to|if|of|off|me|my|on|in|it|is|at|as|we|do|be|has|but|was|so|no|not|or|up|for|ve|ll|re|s)\b/gi;
  const unicode = /[\u0000-\u001F\u007F-\u009F]/g;
  const punctuation = /[!“”‘’"#$%&'()*+,–./\\:;<=>?@[\]^_`{|}~¶]/g;
  const lineBreaks = /[\r\n]+/gm;
  const extraSpaces = /\s+/g;

  return result
    .replace(shortWords, ' ')
    .replace(unicode, ' ')
    .replace(punctuation, ' ')
    .replace(lineBreaks, ' ')
    .replace(extraSpaces, ' ');
};
