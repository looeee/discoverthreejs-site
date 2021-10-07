import { setupNav } from "./modules/layout/nav.js";
import { smoothInternalLinks } from "./modules/layout/smoothInternalLinks.js";

export function setup(spec = {}) {
  window.addEventListener("load", () => {
    const header = document.querySelector("#header");
    if (header) {
      header.classList.remove("fade-out");
      header.classList.add("fade-in");
    }

    setupNav(spec.navCloseElem, spec.navCloseTriggers);

    smoothInternalLinks();

    // document
    //   .querySelector("#introDownButton")
    //   .addEventListener("click", (e) => {
    //     document.querySelector(".wrapper").scrollTo({
    //       top: document.querySelector("main").offsetTop - 100,
    //       left: 0,
    //       behavior: "smooth",
    //     });
    //     e.preventDefault();
    //   });
  });
}
