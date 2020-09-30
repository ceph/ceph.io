/**
 * Creates a 140 character caption from templateContent
 *
 * @param {templateContent} text
 *
 */

module.exports = text => {
  const content = new String(text);

  /* remove all html elements and new lines */
  var re = /(&lt;.*?&gt;)|(<.*?>)/gi;
  var plain = unescape(content.replace(re, ''));

  return plain.substring(0, 136) + '...';
};
