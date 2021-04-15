import Optiscroll from './vendor/Optiscroll.js';

function setupScrollOnElement(
  element,
  wrapContent = false,
  overflowXHidden = false,
) {
  if (!(element instanceof Element)) {
    element = document.querySelector(element);
  }

  element.classList.add('optiscroll');

  const scroller = new Optiscroll(element, {
    maxTrackSize: 95,
    minTrackSize: 5,
    preventParentScroll: true,
    forceScrollbars: !Optiscroll.G.isTouch,
    wrapContent,
  });

  if (overflowXHidden) {
    scroller.scollEl.style.overflowX = 'hidden';
  }

  return scroller;
}

export { setupScrollOnElement };
