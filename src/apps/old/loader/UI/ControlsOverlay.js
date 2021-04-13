export default class ControlsOverlay {
  constructor() {
    this.controlsElem = document.querySelector('#controls-overlay');
  }

  hide() {
    this.controlsElem.classList.add('hide');
  }

  show() {
    this.controlsElem.classList.remove('hide');
  }
}
