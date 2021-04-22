import { setupScrollOnElement } from './setupScrollOnElement';
import { setupScrollOnCodeHighlights } from './setupScrollOnCodeHighlights';
import { scrollToAnchor } from './scrollToAnchor';

function setupScroll(ideEnabled) {
  // setupScrollOnElement('#main-toc');
  // setupScrollOnElement('#filetree', true);
  const mainScroller = setupScrollOnElement('main', false, false);
  // scrollToAnchor(mainScroller);
  // TODO-LOW add prism.js for code highlights
  // setupScrollOnCodeHighlights();
}

export { setupScroll };
