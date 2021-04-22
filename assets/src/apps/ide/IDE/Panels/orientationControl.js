function saveState(string) {
  const state = {
    orientation: string,
  };

  localStorage.setItem(
    'orientation-lock-state',
    JSON.stringify(state),
  );
}

function getState() {
  const state = JSON.parse(
    localStorage.getItem('orientation-lock-state'),
  );

  if (state && state.orientation) return state.orientation;
  return 'auto';
}

class OrientationControl {
  constructor() {
    this.wrapper = document.querySelector('.wrapper');
    const toggle = document.querySelector('#orientation-toggle');
    if (!toggle) return;
    this.label = toggle.labels[0];

    // const autoIcon = this.label.querySelector('.auto-icon');
    // const portraitIcon = this.label.querySelector('.portrait-icon');
    // const landscapeIcon = this.label.querySelector('.landscape-icon');

    this.onChange = () => {};

    this.label.classList.remove('hide');

    const stateValues = ['auto', 'portrait', 'landscape'];

    this.state = getState();

    this.setOrientationLock(this.state, this.onChange);

    toggle.addEventListener('click', (e) => {
      e.preventDefault();

      const nextState =
        stateValues[
          (stateValues.indexOf(this.state) + 1) % stateValues.length
        ];
      this.state = nextState;

      this.setOrientationLock(this.state);

      this.onChange(this.getLayout());
    });
  }

  setOrientationLock(value) {
    switch (value) {
      case 'auto':
        this.wrapper.classList.remove(
          'orientation-portrait',
          'orientation-landscape',
        );
        this.wrapper.classList.add('orientation-auto');
        this.label
          .querySelector('.auto-icon')
          .classList.remove('hide');
        this.label
          .querySelector('.portrait-icon')
          .classList.add('hide');
        this.label
          .querySelector('.landscape-icon')
          .classList.add('hide');
        break;
      case 'portrait':
        this.wrapper.classList.remove(
          'orientation-auto',
          'orientation-landscape',
        );
        this.wrapper.classList.add('orientation-portrait');
        this.label.querySelector('.auto-icon').classList.add('hide');
        this.label
          .querySelector('.portrait-icon')
          .classList.remove('hide');
        this.label
          .querySelector('.landscape-icon')
          .classList.add('hide');
        break;
      case 'landscape':
        this.wrapper.classList.remove(
          'orientation-auto',
          'orientation-portrait',
        );
        this.wrapper.classList.add('orientation-landscape');
        this.label.querySelector('.auto-icon').classList.add('hide');
        this.label
          .querySelector('.portrait-icon')
          .classList.add('hide');
        this.label
          .querySelector('.landscape-icon')
          .classList.remove('hide');
        break;
      default:
        break;
    }

    this.state = value;
    saveState(value);
  }

  getLayout() {
    switch (this.state) {
      case 'landscape':
        return 'horizontal';
      case 'portrait':
        return 'vertical';
      case 'auto':
      default:
        return window.innerHeight > window.innerWidth
          ? 'vertical'
          : 'horizontal';
    }
  }
}

export { OrientationControl };
