export default class LoadingOverlay {
  constructor() {
    this.overlayElem = document.querySelector('#loading-overlay');
  }

  hide() {
    this.overlayElem.classList.add('hide');
  }

  show() {
    this.overlayElem.classList.remove('hide');
  }
}
