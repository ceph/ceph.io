'use strict';
/*global document window*/

(function () {
  const html = document.querySelector('html');
  const header = document.querySelector('[data-site-header]');
  const menu = header.querySelector('[data-menu]');
  const menu_open = header.querySelector('[data-menu-open]');
  const menu_close = header.querySelector('[data-menu-close]');

  const media_query = window.matchMedia('(max-width: 64em)');

  function toggleMenu() {
    menu_open.addEventListener('click', e => {
      header.classList.add('site-header--opened');
      menu.setAttribute('aria-hidden', 'false');
      html.classList.add('no-scroll');
      e.preventDefault();
    });

    menu_close.addEventListener('click', e => {
      header.classList.remove('site-header--opened');
      menu.setAttribute('aria-hidden', 'true');
      html.classList.remove('no-scroll');
      e.preventDefault();
    });
  }

  function handle_size_change(e) {
    if (e.matches) {
      menu.setAttribute('aria-hidden', 'true');
      toggleMenu();
    } else {
      menu.setAttribute('aria-hidden', 'false');
      header.classList.remove('site-header--opened');
      html.classList.remove('no-scroll');
    }
  }

  // Register event listener
  media_query.addEventListener('change', handle_size_change);

  // Initial check
  handle_size_change(media_query);
})();
