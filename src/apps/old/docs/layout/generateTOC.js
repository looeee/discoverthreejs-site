export default function generateTOC() {
  const activeMenuItem = document.querySelector('.toc-active');

  if (!activeMenuItem) return;

  const headings = document
    .querySelector('main')
    .querySelectorAll('h2,h3,h4');

  const innerTOC = document.createElement('ul');
  innerTOC.classList.add('inner-toc');

  headings.forEach(heading => {
    const levelClass = 'header-' + heading.tagName.slice(-1);

    const anchor = document.createElement('a');
    anchor.href = '#' + heading.id;
    anchor.innerHTML = heading.innerHTML;
    anchor.classList.add('internal-link');

    const li = document.createElement('li');
    li.classList.add(levelClass);
    li.appendChild(anchor);

    innerTOC.appendChild(li);
  });

  activeMenuItem.appendChild(innerTOC);
}
