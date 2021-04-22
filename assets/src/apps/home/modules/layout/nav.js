export function setupNav(
  wrapperElem,
  triggers = document.querySelectorAll('.nav-panel-trigger'),
) {
  document.querySelector('main').addEventListener('click', () => {
    triggers.forEach(trigger => {
      trigger.checked = false;
    });
  });
}
