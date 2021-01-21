"use strict";
/*global document window*/

(function() {

  const siteHeader = document.querySelector(".site-header")

  const observer = new IntersectionObserver( 
    ([e]) => e.target.classList.toggle("site-header--stuck", e.intersectionRatio < 1),
    { threshold: [1] }
  );

  observer.observe(siteHeader);

})();