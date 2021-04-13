function backToTopButton() {
  const backToTopButton = document.querySelector('#back-to-top');
  if (!backToTopButton) return;

  window.addEventListener(
    'scroll',
    e => {
      if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
      ) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    },
    true,
  );

  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  )
    backToTopButton.style.display = 'block';

  backToTopButton.addEventListener('click', e => {
    e.preventDefault();

    document.querySelector('#top').scrollIntoView({
      behavior: 'smooth',
    });
  });
}

export default backToTopButton;
