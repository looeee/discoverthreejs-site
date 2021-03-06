// Disable auto formatting. Must be done before importing Prism script
// Note: this is very hacky but it's reccomended by Prism to do it this way
window.Prism = window.Prism || {};
Prism.manual = true;

// Also, to get this hack to work we need to import the bare module
import "./vendor/prism/prism.js";

Prism.plugins.NormalizeWhitespace.setDefaults({
  "remove-trailing": true,
  "remove-indent": true,
  "left-trim": true,
  "right-trim": true,
  // 'break-lines': 80,
  // 'indent': 2,
  "remove-initial-line-feed": false,
  // 'tabs-to-spaces': 4,
  // 'spaces-to-tabs': 4,
});

function setupCodeHighlights() {
  const highlights = document.querySelectorAll(".highlight");

  // line highlight requires waiting a frame to work
  // otherwise lines don't get highlighted until after a resize
  setTimeout(() => {
    for (const element of highlights) {
      Prism.highlightElement(element, false);
    }
  }, 0);
}

export { setupCodeHighlights };
