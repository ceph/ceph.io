import lunr from 'lunr';
import articleCard from '../_11ty/shortcodes/ArticleCard.js';

const SearchOutput = {
  init: () => {
    const urlPath = window.location.pathname.split('/');
    const urlLocale = urlPath[1];
    const searchInput = document.getElementById('search-str');
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
        result.image = searchOutput[result.ref].image;
        result.title = searchOutput[result.ref].title;
        result.author = searchOutput[result.ref].author;
        result.date = searchOutput[result.ref].date;
        result.url = searchOutput[result.ref].url;
        result.content = searchOutput[result.ref].content;
      });

      renderResults(searchResults, searchQuery);
    }

    function renderResults(results = [], searchQuery) {
      let searchResultsHtml;

      if (!searchresultsContainer) return;

      if (!results.length) {
        searchResultsHtml = `<p class="h3 mb-8 xl:mb-10">No results for “${searchQuery}”</p>`;
      } else {
        searchResultsHtml = `<p class="h3 mb-8 xl:mb-10">You searched for “${searchQuery}”</p>
      <ul class="grid md:grid--cols-2 lg:grid--cols-3 xl:grid--cols-4 list-none m-0 p-0">${results
        .map(result => {
          const { author, content, date, image, title, url } = result;

          const restucturedData = {
            data: {
              author,
              date,
              image,
              title,
              locale: urlLocale,
            },
            templateContent: content,
            url,
          };

          return `<li>${articleCard(restucturedData)}</li>`;
        })
        .join('')}</ul>`;
      }

      searchresultsContainer.innerHTML = searchResultsHtml;
    }

    initSearchIndex();
  },
};

export { SearchOutput };
