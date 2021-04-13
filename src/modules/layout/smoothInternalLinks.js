export function smoothInternalLinks() {
  const internalLinks = document.querySelectorAll("a[href^='#']");

  internalLinks.forEach(link => {
    const id = '#' + link.href.split('#')[1];

    if (!id.includes('lightbox')) {
      const target = document.querySelector(id);

      if (target) {
        link.addEventListener('click', e => {
          e.preventDefault();

          window.scrollTo({
            top: target.offsetTop - 100,
            left: 0,
            behavior: 'smooth',
          });
        });
      }
    }
  });
}
