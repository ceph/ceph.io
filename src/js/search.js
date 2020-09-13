const searchInput = document.getElementById('search-str');
const searchSubmit = document.getElementById('search-submit');
const searchresultsContainer = document.getElementById('search-results');

let postsIndex, searchIndex, searchResults, searchResultsHtml;

async function initSearchIndex() {
  const response = await fetch('/search.json');
  postsIndex = await response.json();
  searchIndex = lunr(function () {
    this.field('title');
    this.field('author');
    this.field('date');
    this.ref('url');
    this.field('content');
    postsIndex.forEach(post => this.add(post));
  });
}

searchSubmit.addEventListener('click', event => {
  const searchQuery = searchInput.value.trim().toLowerCase();
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

  event.preventDefault();
});

function formatDate(date, locale = 'en-GB') {
  console.log(locale);
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
    searchResultsHtml = `<ul class="ul">${results
      .map(({ data = {} }) => {
        const { author, date, title, url } = data;
        return `<li>
                  <a href="${url}">${title}</a>
                  <span class="block">${author}</span>
                  <time datetime="${date}">${formatDate(date)}</time>
                </li>`;
      })
      .join('')}</ul>`;
  }

  searchresultsContainer.innerHTML = searchResultsHtml;
}

initSearchIndex();
