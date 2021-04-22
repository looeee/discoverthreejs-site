function setupJumpToTop(link) {
  const heading = document.querySelector('h1');
  link.href = `#${heading.id}`;

  const toc = document.querySelector('.table-of-contents');

  link.addEventListener('click', () => {
    // HACK: the highlightCurrentPositionInTOC function re-highlights
    // the next visible link as active after a tiny delay.
    // add an even longer delay to overcome this
    setTimeout(() => {
      for (const child of toc.querySelectorAll('.is-visible')) {
        child.classList.remove('is-visible');
      }

      for (const child of toc.querySelectorAll('.is-active')) {
        child.classList.remove('is-active');
      }
    }, 100);
  });
}

export { setupJumpToTop };
