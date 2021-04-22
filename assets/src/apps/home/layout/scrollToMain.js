function scrollToMain() {
  const introIcon = document.querySelector('#introScrollIcon');
  const intro = document.querySelector('#intro');
  const scrollTo = document.querySelector('#header');

  if (!introIcon || !intro || !scrollTo) return;

  window.addEventListener(
    'scroll',
    e => {
      if (
        document.body.scrollTop > 300 ||
        document.documentElement.scrollTop > 300
      ) {
        // scrollTo.classList.remove( 'fade-out' );
        // scrollTo.classList.add( 'fade-in' );
        intro.classList.add('hidden');
      } else {
        // scrollTo.classList.remove( 'fade-in' );
        // scrollTo.classList.add( 'fade-out' );
        intro.classList.remove('hidden');
      }
    },
    true,
  );

  introIcon.addEventListener('click', e => {
    e.preventDefault();

    scrollTo.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      // inline: "end"
    });
  });
}

export { scrollToMain };
