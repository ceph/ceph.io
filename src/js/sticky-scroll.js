"use strict";
/*global document window*/

(function() {

  const scroll_offset = document.querySelector('[data-scroll-offset]')
  const site_header = document.querySelector('[data-site-header]');

  const observer = new IntersectionObserver( 
    ([e]) => site_header.classList.toggle("site-header--stuck", e.intersectionRatio < 1),
    { threshold: [1] }
  );

  observer.observe(scroll_offset);

})();