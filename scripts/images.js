const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');

const util = require('util');
const path = require('path');
const fs = require('graceful-fs');
const makeDir = require('make-dir');
const writeFile = util.promisify(fs.writeFile);

const srcDir = 'src';
const distDir = 'dist';

(async () => {
  const files = await imagemin([srcDir + '/**/*.{jpg,jpeg,png,svg,gif}'], {
    plugins: [
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
      imageminSvgo({
        plugins: [{ removeViewBox: false }],
      }),
      imageminGifsicle({
        colors: 96,
        optimizationLevel: 2,
      }),
    ],
  });

  const { length } = files;
  files.forEach(async v => {
    let source = path.parse(v.sourcePath);
    v.destinationPath = `${source.dir.replace(srcDir, distDir)}/${source.name}${
      source.ext
    }`;
    await makeDir(path.dirname(v.destinationPath));
    await writeFile(v.destinationPath, v.data);
  });
  console.log(`${length} image${length !== 1 ? 's' : ''} minified`);
})();
