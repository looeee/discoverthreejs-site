import { setupScrollOnElement } from './setupScrollOnElement';

function setupScrollOnCodeHighlights() {
  const highlights = document.querySelectorAll('.lntable');

  for (const highlight of highlights) {
    const code = highlight.querySelectorAll('.lntd')[1];
    console.log('code: ', code);
    // setupScrollOnElement(code, false);
  }
}

export { setupScrollOnCodeHighlights };
