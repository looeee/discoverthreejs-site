import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';

function renderLatex() {
  renderMathInElement(document.querySelector('.content'), {
    delimiters: [
      {
        left: '$$',
        right: '$$',
        display: true,
      },
      {
        left: '\\[',
        right: '\\]',
        display: true,
      },
      {
        left: '$',
        right: '$',
        display: false,
      },
    ],
    output: 'html',
    strict: false,
  });
}

export { renderLatex };
