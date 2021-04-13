function scrollToAnchor() {
  if (window.location.hash.length > 0) {
    if (window.location.hash.includes('lightbox')) return;
    const target = document.querySelector(window.location.hash);
    if (target) {
      document.querySelector('.scroller').scrollTo({
        top: target.offsetTop - 100,
        left: 0,
        behavior: 'auto',
      });
    }
  }
}

export { scrollToAnchor };
