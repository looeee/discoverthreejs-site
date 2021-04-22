import { setup } from "./base.js";

import { scrollToMain } from "./layout/scrollToMain.js";

import { initScene } from "./book/book.js";

setup({
  navCloseElem: "#wrapper",
});

scrollToMain();

initScene();
