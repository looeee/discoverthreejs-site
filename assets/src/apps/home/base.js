import { moveAnchorIntoView } from "./modules/layout/moveAnchorIntoView.js";
import { setupNav } from "./modules/layout/nav.js";
import { smoothInternalLinks } from "./modules/layout/smoothInternalLinks.js";

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
