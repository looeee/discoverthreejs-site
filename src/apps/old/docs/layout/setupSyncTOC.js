let toc;
let tocItems;

const checkVisible = elem => {
  const rect = elem.getBoundingClientRect();
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight,
  );
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
};

function syncTOC() {
  const headersVisible = [];
  const headersInvisible = [];

  tocItems.forEach(item => {
    if (item.firstChild.nodeName === 'A') {
      const header = document.getElementById(
        item.firstChild.href.split('#').pop(),
      );

      if (header !== null) {
        if (checkVisible(header)) {
          headersVisible.push(item);
        } else {
          headersInvisible.push(item);
        }
      }
    }
  });

  if (headersVisible.length > 0) {
    headersVisible.forEach(header => {
      header.classList.add('toc-header-visible');
    });
    headersInvisible.forEach(header => {
      header.classList.remove('toc-header-visible');
    });
  }
}

export default function setupSyncTOC() {
  toc = document.querySelector('.inner-toc');
  if (!toc) return;

  tocItems = [].slice.call(toc.querySelectorAll('li'));

  syncTOC();
  window.addEventListener('resize', syncTOC, false);
  window.addEventListener('scroll', syncTOC, false);
}
