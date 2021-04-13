const getScrollAmount = () => {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
};

export default function shrinkMenuOnScroll() {
  let prevScroll = getScrollAmount();

  const nav = document.querySelector('.nav-wrapper');
  const triggers = document.querySelectorAll('.nav-panel-trigger');

  if (!nav) return;

  const onScroll = () => {
    const currentScroll = getScrollAmount();

    let checked = false;
    triggers.forEach(trigger => {
      if (trigger.checked) checked = true;
    });

    // don't hide if either menu is open
    if (checked) return;

    if (currentScroll > prevScroll) {
      nav.classList.add('offscreen');
    } else {
      nav.classList.remove('offscreen');
    }

    prevScroll = currentScroll;
  };

  window.addEventListener('scroll', onScroll, true);
}
