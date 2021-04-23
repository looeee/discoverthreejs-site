// generate TOC from h2-h4 in current chapter and append to left menu
import { highlightCurrentPositionInToc } from "./highlightCurrentPositionInTOC.js";
import { setupJumpToTop } from "./jumpToTop.js";

function scrollToActiveChapter(menu, activeChapter) {
  const list = menu.querySelector("ul");

  list.scrollTo(0, activeChapter.offsetTop - list.offsetTop - 10);
}

function getActiveChapter(menu) {
  const currentPath = window.location.pathname;
  const activeLink = menu.querySelector(`a[href="${currentPath}"]`);
  if (!activeLink) return {};

  const activeChapter = activeLink.parentNode;
  return { activeLink, activeChapter };
}

function generateCurrentChapterTOC() {
  const menu = document.querySelector(".table-of-contents");
  const { activeLink, activeChapter } = getActiveChapter(menu);
  const content = document.querySelector(".content");

  if (!menu || !activeChapter) {
    // console.warn("Couldn't generate active chapter TOC");
    return;
  }

  activeChapter.classList.add("active");
  setupJumpToTop(activeLink);

  scrollToActiveChapter(menu, activeChapter);

  const headings = content.querySelectorAll("h2,h3,h4");

  const innerTOC = document.createElement("ul");
  innerTOC.id = "current-chapter-TOC";

  headings.forEach((heading) => {
    if (!heading.id) return;
    const levelClass = `heading-${heading.tagName.slice(-1)}`;

    const anchor = document.createElement("a");
    anchor.href = `#${heading.id}`;

    const text = (heading.innerText || heading.textContent)
      .replace("#", "")
      .replace("<", "")
      .replace(">", "");

    anchor.innerHTML = text;

    anchor.addEventListener("click", () => {
      window.history.pushState(text, text, `#${heading.id}`);
    });

    const li = document.createElement("li");
    li.classList.add(levelClass);
    li.appendChild(anchor);

    innerTOC.appendChild(li);
  });

  activeChapter.appendChild(innerTOC);

  highlightCurrentPositionInToc.init(innerTOC);
}

export { generateCurrentChapterTOC };
