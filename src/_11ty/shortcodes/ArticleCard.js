const filtersDir = `../filters`;
const formatDate = require(`${filtersDir}/formatDate.js`);
const getSingleDigitFromDate = require(`${filtersDir}/getSingleDigitFromDate.js`);
const cleanCardContent = require(`${filtersDir}/cleanCardContent.js`);
const truncate = require(`${filtersDir}/truncate.js`);

module.exports = ({ data = {}, templateContent, url } = {}, { label } = {}) => {
  const { author = '', date, image, title = '', locale = '' } = data;
  const imageSrc = image
    ? image
    : `/assets/bitmaps/photo-texture-0${getSingleDigitFromDate(date)}.jpg`;
  const captionStrip = cleanCardContent(templateContent);
  const caption = truncate(captionStrip);

  return `
    <div class="relative">
      <div class="aspect-ratio aspect-ratio--16x9 aspect-ratio--cover mb-4 rounded-2">
        <img
          alt="" 
          class="absolute h-full left-0 rounded-2 top-0 w-full"
          loading="lazy"
          src="${imageSrc}" 
        />
        ${
          label
            ? `
          <span class="absolute bg-red-500 block color-white m-4 p px-3 py-2 right-0 rounded-2 text-semibold text-upper top-0">
            ${label}
          </span>
        `
            : ''
        }
      </div>
      ${
        title &&
        `
        <a class="block color-navy link-cover h4 mb-2" href="${url}">
          ${title}
        </a>
        `
      }
      <p class="p-sm">
        <time datetime="${date}">
          ${formatDate(date, locale)}
        </time> ${author && `by ${author}`}
      </p>
      ${
        caption &&
        `
        <p class="p">
          ${caption}
        </p>
      `
      }
    </div>
  `;
};
