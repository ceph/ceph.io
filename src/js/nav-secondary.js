"use strict";
/*global document window*/

(function() {
  const navigation = document.querySelector('[data-nav-secondary');

  if (navigation) {
    const toggle = navigation.querySelector('[data-nav-secondary-toggle]');
    const navigation_sub = navigation.querySelector('[data-nav-secondary-sub]');
    const media_query = window.matchMedia('(width < 64em)')
  
    navigation.classList.add('js-nav-secondary');
  
    function toggle_nav(e) {
      if (navigation.classList.contains("js-nav-secondary--opened")) {
        navigation.classList.remove('js-nav-secondary--opened');
        navigation_sub.setAttribute("aria-hidden", "true");
      } else {
        navigation.classList.add('js-nav-secondary--opened');
        navigation_sub.setAttribute("aria-hidden", "false");
      }
      e.preventDefault();
    }
   
    function handle_size_change(e) {
      if (e.matches) {
        toggle.addEventListener('click', toggle_nav);
        navigation_sub.setAttribute("aria-hidden", "true");
      }
      else {
        toggle.removeEventListener('click', toggle_nav);
        navigation_sub.setAttribute("aria-hidden", "false");
        navigation.classList.remove('js-nav-secondary--opened');
      }
    }
    
    // Register event listener
    media_query.addEventListener('change', handle_size_change);
    
    // Initial check
    handle_size_change(media_query);
  }

})();