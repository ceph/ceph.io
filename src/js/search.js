// import articleCard from '/js/article-card.js';

const urlPath = window.location.pathname.split('/');
const urlLocale = urlPath[1];
const searchInput = document.getElementById('search-str');
const searchSubmit = document.getElementById('search-submit');
const searchresultsContainer = document.getElementById('search-results');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const query = urlParams.get('q');

let postsIndex, searchIndex, searchResults, searchResultsHtml, hello;

async function initSearchIndex() {
  const response = await fetch(`/${urlLocale}/news/blog/search.json`);
  postsIndex = await response.json();
  searchIndex = lunr(function () {
    this.field('title');
    this.field('author');
    this.field('date');
    this.ref('url');
    this.field('content');
    postsIndex.forEach(post => this.add(post));
  });

  // const response = await fetch(`/${urlLocale}/news/blog/index.json`);
  // postsIndex = await response.json();
  // searchIndex = lunr.Index.load(postsIndex);

  // let index = await fetch(`/${urlLocale}/news/blog/index.json`);
  // let indexData = await index.json();

  // const docs = await fetch(`/${urlLocale}/news/blog/search.json`);
  // hello = await docs.json();

  if (!urlParams.has('q')) return;
  search(query);
}

function search(searchQuery) {
  searchInput.value = searchQuery;

  const searchResults = searchIndex.search(searchQuery);

  searchResults.forEach(result => {
    const matchingPost = postsIndex.find(post => post.url === result.ref);
    if (!matchingPost) return;

    const { title, author, date, url, content } = matchingPost;
    const searchData = {
      title,
      author,
      date,
      url,
      content,
    };
    result.data = searchData;
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
        .map(({ data = {} }) => {
          const { author, content, date, image, title, url } = data;

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
