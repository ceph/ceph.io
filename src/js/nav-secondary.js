"use strict";
/*global document window*/

(function() {
  const navigation = document.querySelector('[data-nav-secondary]');

  if (navigation) {
    const toggle = navigation.querySelector('[data-nav-secondary-toggle]');
    const navigation_sub = navigation.querySelector('[data-nav-secondary-sub]');
    const media_query = window.matchMedia('(width < 64em)')
  
    function toggle_nav(e) {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-pressed', 'false');
        navigation_sub.setAttribute('aria-hidden', 'true');
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-pressed', 'true');
        navigation_sub.setAttribute('aria-hidden', 'false');
      }
      e.preventDefault();
    }
   
    function handle_size_change(e) {
      if (e.matches) {
        toggle.addEventListener('click', toggle_nav);
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-pressed', 'false');
        toggle.setAttribute('role', 'button');
        navigation_sub.setAttribute('aria-hidden', 'true');
      }
      else {
        toggle.removeEventListener('click', toggle_nav);
        toggle.removeAttribute('aria-expanded');
        toggle.removeAttribute('aria-pressed');
        toggle.removeAttribute('role');
        navigation_sub.setAttribute('aria-hidden', 'false');
      }
    }
    
    // Register event listener
    media_query.addEventListener('change', handle_size_change);
    
    // Initial check
    handle_size_change(media_query);
  }

})();