function setupBackToTopButton(scroller) {
  const button = document.querySelector('#back-to-top');

  if (!button) {
    console.log('Back To Top button not present');
    return;
  }

  button.addEventListener('click', () => {
    button.classList.remove('show');

    scroller.scrollTo(false, 0);
  });
}

export { setupBackToTopButton };
