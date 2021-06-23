const OffCanvas = {
  init: () => {
    const html = document.querySelector('html');
    const header = document.querySelector('[data-site-header]');
    const menu = header.querySelector('[data-menu]');
    const menu_open = header.querySelector('[data-menu-open]');
    const menu_close = header.querySelector('[data-menu-close]');
    const mediaQueryList = window.matchMedia('(max-width: 63.9375em)');

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
    // Includes fallback for Safari <14
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handle_size_change);
    } else {
      mediaQueryList.addListener(handle_size_change);
    }

    // Initial check
    handle_size_change(mediaQueryList);
  },
};

export { OffCanvas };
