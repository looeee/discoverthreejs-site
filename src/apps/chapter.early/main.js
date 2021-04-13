import { setupInvertColorsToggle } from './layout/invertColors.js';
import { setupOffscreenMenus } from './menus/offscreenMenus.js';

function setupChapterEarly() {
  setupInvertColorsToggle();
  document.body.classList.remove('loading-page');
  setupOffscreenMenus();
}

export { setupChapterEarly };
