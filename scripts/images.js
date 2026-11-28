const sharp = require('sharp');
const svgo = require('svgo');

const path = require('path');
const fs = require('fs/promises');

const srcDir = 'src';
const distDir = 'dist';
const extensions = ['.jpg', '.jpeg', '.png', '.svg', '.gif'];
const concurrency = 8;

// Keyed by the format of the file's contents, which doesn't always match its extension
const optimizers = {
  jpeg: data => sharp(data).jpeg({ quality: 75, mozjpeg: true }).toBuffer(),
  png: data =>
    sharp(data)
      .png({ palette: true, quality: 80, compressionLevel: 9 })
      .toBuffer(),
  // svgo 4's preset-default keeps viewBox
  svg: async data =>
    svgo.optimize(data.toString(), {
      multipass: true,
      plugins: ['preset-default'],
    }).data,
};

// Files in other formats are copied as they are. That includes GIFs: sharp can only
// cut a GIF to 2, 4, 16 or 256 colors.
const minify = async data => {
  const { format } = await sharp(data, { limitInputPixels: false })
    .metadata()
    .catch(() => ({}));
  return optimizers[format] ? optimizers[format](data) : data;
};

(async () => {
  const files = (await fs.readdir(srcDir, { recursive: true })).filter(
    file =>
      extensions.includes(path.extname(file)) &&
      !file.split(path.sep).some(part => part.startsWith('.'))
  );

  const queue = [...files];
  const worker = async () => {
    for (let file = queue.shift(); file; file = queue.shift()) {
      const source = path.join(srcDir, file);
      const destination = path.join(distDir, file);
      try {
        const data = await minify(await fs.readFile(source));
        await fs.mkdir(path.dirname(destination), { recursive: true });
        await fs.writeFile(destination, data);
      } catch (error) {
        throw new Error(`${source}: ${error.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));

  const { length } = files;
  console.log(`${length} image${length !== 1 ? 's' : ''} minified`);
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
