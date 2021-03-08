// import articleCard from '/js/article-card.js';

const urlPath = window.location.pathname.split('/');
const urlLocale = urlPath[1];
const searchInput = document.getElementById('search-str');
const searchSubmit = document.getElementById('search-submit');
const searchresultsContainer = document.getElementById('search-results');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const query = urlParams.get('q');

async function initSearchIndex() {
  const searchIndexData = await fetch(
    `/${urlLocale}/news/blog/search-index.json`
  );
  const index = await searchIndexData.json();
  const lunrIndex = lunr.Index.load(index);

  const searchOutputData = await fetch(
    `/${urlLocale}/news/blog/search-output.json`
  );
  const output = await searchOutputData.json();

  if (!urlParams.has('q')) return;
  search(lunrIndex, query, output);
}

function search(lunrIndex, searchQuery, searchOutput) {
  searchInput.value = searchQuery;

  let searchResults = lunrIndex.search(query);

  searchResults.forEach(result => {
    result.title = searchOutput[result.ref].title;
    result.author = searchOutput[result.ref].author;
    result.date = searchOutput[result.ref].date;
    result.url = searchOutput[result.ref].url;
    result.content = searchOutput[result.ref].content;
  });

  renderResults(searchResults, searchQuery);
}

function formatDate(date, locale = 'en-GB') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

function renderResults(results = [], searchQuery) {
  if (!searchresultsContainer) return;

  if (!results.length) {
    searchResultsHtml = `<p class="p">No results for "<strong>${searchQuery}</strong>"</p>`;
  } else {
    searchResultsHtml = `<p class="p">You searched for "<strong>${searchQuery}</strong>"</p>
      <ul class="grid md:grid--cols-2 lg:grid--cols-3 xl:grid--cols-4 list-none m-0 p-0">${results
        .map(result => {
          const { author, content, date, image, title, url } = result;

          // return `<li>${articleCard(data)}</li>`;

          return `<li>
                    <div class="relative">
                      <div class="aspect-ratio aspect-ratio--16x9 aspect-ratio--contain bg-grey-500 mb-4">
                        <img alt="" class="absolute h-full left-0 rounded-2 top-0" loading="lazy" src="${image}" />
                      </div>
                      <a class="block color-navy link-cover h4 mb-2" href="${url}">
                        ${title}
                      </a>
                      <p class="p-sm">
                      <time datetime="${date}">${formatDate(
            date
          )}</time> by ${author}
                      </p>
                      <p class="p">
                      ${content}
                      </p>
                    </div>
                 </li>`;
        })
        .join('')}</ul>`;
  }

  searchresultsContainer.innerHTML = searchResultsHtml;
}

initSearchIndex();
