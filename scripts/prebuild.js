'use strict';

const cpy = require('cpy');
const path = require('path');

const site = require('../src/_data/site');
const locales = require('../src/_data/locales');

module.exports = (async () => {
  console.log('Prebuilding...');

  try {
    const { defaultLocale } = site;
    const supportingLocales = locales
      .filter(({ code }) => code !== defaultLocale)
      .map(({ code }) => code);

    const filesToCopy = supportingLocales.map(code => {
      return cpy(
        // Any file types that should be duplicated to language sites.
        // Important to copy .json and .js file types, as these will often
        // contain the 11ty data required to set locales/collections.
        '**/*.{html,md,njk,json,js,jpg,jpeg,png,svg}',
        path.join(process.cwd(), `src/${code}`),
        {
          cwd: path.join(process.cwd(), `src/${defaultLocale}`),
          overwrite: false,
          parents: true,
        }
      );
    });

    await Promise.all(filesToCopy);

    console.log(
      `Copied files to ${supportingLocales.join(', ')} language sites`
    );
  } catch (error) {
    console.error(error);
  }
})();
