function saveState(bool) {
  const state = {
    invertedColors: bool,
  };

  localStorage.setItem('colors-theme-state', JSON.stringify(state));
}

function getState() {
  const state = JSON.parse(
    localStorage.getItem('colors-theme-state'),
  );

  if (state && state.invertedColors) return state.invertedColors;
  return false;
}

function setupInvertColorsToggle() {
  const body = document.querySelector('body');

  const toggle = document.querySelector('#invert-colors-toggle');

  if (!toggle) return;

  const setInverted = (bool) => {
    if (bool === true) {
      body.classList.add('invert-colors');
    } else {
      body.classList.remove('invert-colors');
    }

    saveState(bool);
  };

  const invertedColors = getState();
  setInverted(invertedColors);
  if (invertedColors === true) toggle.checked = true;

  toggle.addEventListener('change', () => {
    if (toggle.checked) setInverted(true);
    else setInverted(false);
  });
}

export { setupInvertColorsToggle };
