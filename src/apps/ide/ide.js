import { IDE } from "./IDE/IDE.js";

async function setupIDE(config) {
  const ideWrapper = document.querySelector("#ide-wrapper");
  const ideControls = document.querySelectorAll(".ide-control");

  if (config.showIDE === true && ideWrapper) {
    ideControls.forEach((ctrl) => ctrl.classList.remove("hide"));

    const ide = new IDE(config.IDE);
    await ide.init();

    ideWrapper.classList.remove("hide");
  } else if (ideWrapper) {
    ideWrapper.classList.add("hide");
  }
}

export { setupIDE };
