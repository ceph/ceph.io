import iframeResize from 'iframe-resizer/js/iframeResizer';

if (document.getElementById('iframe-landscape')) {
  iframeResize(
    { log: false, checkOrigin: ['https://landscape.cephfoundation.org'] },
    '#iframe-landscape'
  );
}
