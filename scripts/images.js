const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');
const chunk = require('lodash.chunk');

const path = require('path');
const fs = require('fs/promises');

const srcDir = 'src';
const distDir = 'dist';
const BATCH_SIZE = 8;
const imagePattern = /\.(jpg|jpeg|png|svg|gif)$/i;

const allPlugins = [
  imageminMozjpeg({ quality: 75 }),
  imageminPngquant({ quality: [0.6, 0.8] }),
  imageminSvgo({ plugins: [{ removeViewBox: false }] }),
  imageminGifsicle({ colors: 96, optimizationLevel: 2 }),
];

function destinationPathFor(imagePath) {
  return path.join(distDir, path.relative(srcDir, imagePath));
}

async function collectImagePaths(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      paths.push(...(await collectImagePaths(fullPath)));
    } else if (imagePattern.test(entry.name)) {
      paths.push(fullPath);
    }
  }

  return paths;
}

async function writeOptimizedFile(file) {
  const destinationPath = destinationPathFor(file.sourcePath);
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.writeFile(destinationPath, file.data);
}

async function copyOriginalImage(imagePath) {
  const destinationPath = destinationPathFor(imagePath);
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.copyFile(imagePath, destinationPath);
}

async function optimizeImage(imagePath) {
  try {
    const files = await imagemin([imagePath], { plugins: allPlugins });

    if (!files.length) {
      throw new Error(`No output for ${imagePath}`);
    }

    await writeOptimizedFile(files[0]);
  } catch (error) {
    console.warn(
      `Warning: could not optimize ${imagePath}, copying original (${
        error.code || error.message
      })`
    );
    await copyOriginalImage(imagePath);
  }
}

async function optimizeBatch(batch) {
  try {
    const files = await imagemin(batch, { plugins: allPlugins });
    await Promise.all(files.map(writeOptimizedFile));
  } catch (error) {
    console.warn(
      `Warning: batch optimize failed (${
        error.code || error.message
      }), retrying file-by-file`
    );
    await Promise.all(batch.map(optimizeImage));
  }
}

(async () => {
  const imagePaths = await collectImagePaths(srcDir);
  const batches = chunk(imagePaths, BATCH_SIZE);

  for (const batch of batches) {
    await optimizeBatch(batch);
  }

  console.log(
    `${imagePaths.length} image${imagePaths.length !== 1 ? 's' : ''} processed`
  );
})().catch(error => {
  console.error(error);
  process.exit(1);
});
