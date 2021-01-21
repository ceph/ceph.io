"use strict";
/*global document window*/

(function() {

  const navigation = document.querySelector('[data-nav-secondary');
  const toggle = navigation.querySelector('[data-nav-secondary-toggle]');
  const navigation_sub = navigation.querySelector('[data-nav-secondary-sub]');

  const media_query = window.matchMedia('(width < 64em)')

  navigation.classList.add('js-nav-secondary');

  function toggleNav() {
    toggle.addEventListener('click', (e) => {
      if (navigation.classList.contains("js-nav-secondary--opened")) {
        navigation.classList.remove('js-nav-secondary--opened');
        navigation_sub.setAttribute("aria-hidden", "true");
      } else {
        navigation.classList.add('js-nav-secondary--opened');
        navigation_sub.setAttribute("aria-hidden", "false");
      }
      e.preventDefault();
    });
  }
 
  function handle_size_change(e) {
    if (e.matches) {
      navigation_sub.setAttribute("aria-hidden", "true");
      toggleNav();
    }
    else {
      navigation_sub.setAttribute("aria-hidden", "false");
      navigation.classList.remove('js-nav-secondary--opened');
    }
  }
  
  // Register event listener
  media_query.addEventListener('change', handle_size_change);
  
  // Initial check
  handle_size_change(media_query);

})();