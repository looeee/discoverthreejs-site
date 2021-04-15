function addAnchorLinks() {
  const content = document.querySelector('.content');

  if (!content) return;
  const headings = content.querySelectorAll('h2,h3,h4,h5,h6');

  headings.forEach((heading) => {
    if (heading.classList.contains('no-anchor')) {
      return;
    }
    const id = heading.getAttribute('id');

    const anchor = document.createElement('a');
    anchor.className = 'anchor-link';
    anchor.href = `#${id}`;
    anchor.innerText = '#';

    heading.appendChild(anchor);
  });
}

export { addAnchorLinks };
