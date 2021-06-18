import lunr from 'lunr';
import articleCard from '../_11ty/shortcodes/ArticleCard.js';
import translations from '../_data/i18n';

const SearchOutput = {
  init: () => {
    const urlParts = window.location.pathname.split('/') || [];
    const urlLocale = urlParts[1];
    const blogDir = `/${urlLocale}/news/blog`;
    const searchDataUrls = [
      `${blogDir}/search-index.json`,
      `${blogDir}/search-output.json`,
    ];
    const searchInput = document.getElementById('search-str');
    const searchresultsContainer = document.getElementById('search-results');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const query = urlParams.get('q');

    async function initSearchIndex() {
      if (!urlParams.has('q')) return;

      try {
        searchInput.value = query;

        const [searchIndex, searchOutput] = await Promise.all(
          searchDataUrls.map(url =>
            fetch(url, {
              method: 'GET',
              credentials: 'include',
              mode: 'no-cors',
            }).then(res => res.json())
          )
        );
        const lunrIndex = lunr.Index.load(searchIndex);

        search(lunrIndex, searchOutput);
      } catch (error) {
        console.error(error);
        renderError();
      }
    }

    function search(lunrIndex, searchOutput) {
      let searchResults = lunrIndex.search(query);

      searchResults.forEach(result => {
        result.image = searchOutput[result.ref].image;
        result.title = searchOutput[result.ref].title;
        result.author = searchOutput[result.ref].author;
        result.date = searchOutput[result.ref].date;
        result.url = searchOutput[result.ref].url;
        result.content = searchOutput[result.ref].content;
      });

      renderResults(searchResults);
    }

    function renderResults(results = []) {
      let searchResultsHtml;

      const { blog_search_no_results = {}, blog_searched_for = {} } =
        translations || {};
      const noResultsString =
        blog_search_no_results[urlLocale] || 'No results for';
      const searchedForString =
        blog_searched_for[urlLocale] || 'You searched for';

      if (!searchresultsContainer) return;

      if (!results.length) {
        searchResultsHtml = `<p class="h3 mb-8 xl:mb-10">${noResultsString} “${query}”</p>`;
      } else {
        searchResultsHtml = `<p class="h3 mb-8 xl:mb-10">${searchedForString} “${query}”</p>
      <ul class="grid md:grid--cols-2 lg:grid--cols-3 xl:grid--cols-4 list-none m-0 p-0">${results
        .map(({ author, content, date, image, title, url }) => {
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

    function renderError() {
      const { blog_search_failed = {} } = translations || {};
      const errorMessage =
        blog_search_failed[urlLocale] ||
        'Sorry, we couldn’t complete your search at this time. Please try again shortly.';

      const searchResultsHtml = `<p class="h3 mb-8 xl:mb-10">${errorMessage}</p>`;

      searchresultsContainer.innerHTML = searchResultsHtml;
    }

    initSearchIndex();
  },
};

export { SearchOutput };
