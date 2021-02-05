'use strict';
/*global document window*/

(function () {
  const body = document.querySelector('body');
  const siteHeader = document.querySelector('.site-header');
  const observer = new IntersectionObserver(
    ([e]) =>
      e.target.classList.toggle('site-header--stuck', e.intersectionRatio < 1),
    { threshold: [1] }
  );

  if (!body.classList.contains('home')) return;
  observer.observe(siteHeader);
})();
