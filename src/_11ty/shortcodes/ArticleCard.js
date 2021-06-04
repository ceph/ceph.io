const filtersDir = `../filters`;
const getArticleType = require(`${filtersDir}/getArticleType.js`);
const formatDate = require(`${filtersDir}/formatDate.js`);
const removeHtml = require(`${filtersDir}/removeHtml.js`);
const truncate = require(`${filtersDir}/truncate.js`);

module.exports = (
  { data = {}, templateContent, url } = {},
  { showLabel } = {}
) => {
  const { author = '', date, image, tags, title = '', locale = '' } = data;
  const imageSrc = image ? image : '/assets/bitmaps/photo-water-02.jpg';
  const captionStrip = removeHtml(templateContent);
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
          showLabel
            ? `
          <span class="absolute bg-red-500 block color-white m-4 p px-3 py-2 right-0 rounded-2 text-semibold top-0">
            ${getArticleType(tags)}
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
