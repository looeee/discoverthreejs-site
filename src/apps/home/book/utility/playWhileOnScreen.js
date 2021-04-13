export function playWhileOnScreen(app) {
  if (typeof IntersectionObserver !== 'function') {
    app.start();
    return;
  }

  const callback = entries => {
    const onScreen = entries[0].isIntersecting;

    if (onScreen) app.start();
    else app.stop();
  };

  const observer = new IntersectionObserver(callback);

  observer.observe(app.container);
}
