import lunr from 'lunr';

const SearchOutput = {
  init: () => {
    const urlPath = window.location.pathname.split('/');
    const urlLocale = urlPath[1];
    const searchInput = document.getElementById('search-str');
    const searchSubmit = document.getElementById('search-submit');
    const searchresultsContainer = document.getElementById('search-results');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const query = urlParams.get('q');

    let postsIndex, searchIndex, searchResults, searchResultsHtml;

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
      <ul class="ul">${results
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
  },
};

export { SearchOutput };
