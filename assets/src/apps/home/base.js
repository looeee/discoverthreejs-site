import { setupNav } from "./modules/layout/nav.js";

// import {setupLightboxes} from './modules/layout/setupLightboxes.js';
import { smoothInternalLinks } from "./modules/layout/smoothInternalLinks.js";
import { moveAnchorIntoView } from "./modules/layout/moveAnchorIntoView.js";

export function setup(spec = {}) {
  window.addEventListener("load", () => {
    const header = document.querySelector("#header");
    if (header) {
      header.classList.remove("fade-out");
      header.classList.add("fade-in");
    }

    moveAnchorIntoView();
    setupNav(spec.navCloseElem, spec.navCloseTriggers);

    // setupLightboxes();
    smoothInternalLinks();
  });
}
