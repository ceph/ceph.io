const htmlmin = require('html-minifier');

module.exports = (content, outputPath) => {
  if (outputPath && outputPath.endsWith('.html')) {
    return htmlmin.minify(content, {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
    });
  }

  return content;
};
