function setupOnscrollEvent(scroller) {
  const nav = document.querySelector('.top-nav');
  const wrapper = document.querySelector('.wrapper');

  if (!nav || !wrapper) {
    console.log('Scroller elements not found');
  }

  let prevScroll = 0;

  const onScroll = (e) => {
    const currentScroll = e.detail.scrollTop;

    if (currentScroll > 100) backToTopButton.classList.add('show');
    else backToTopButton.classList.remove('show');

    prevScroll = currentScroll;
  };

  scroller.element.addEventListener('scroll', onScroll);
}

export { setupOnscrollEvent };
