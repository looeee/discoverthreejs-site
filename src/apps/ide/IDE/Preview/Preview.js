import { HTMLBuilder } from '../HTML/HTMLBuilder.js';
import { uuid } from './utils/uuid.js';

class Preview {
  constructor() {
    this.frame = HTMLBuilder.buildPreviewFrame();
    this.externalPreviews = {};
    this.setupLogging();

    this.previewHider = document.querySelector('#preview-overlay');

    this.frame.onload = () => {
      this.onLoad();

      // hiding the preview during refresh reduces flickering
      this.previewHider.style.display = 'none';
    };
  }

  setupLogging() {
    // TODO
    // this.consolePanel = document.querySelector('#preview-console');
  }

  update(src) {
    this.previewHider.style.display = 'block';
    this.frame.src = src;
    for (const name of Object.keys(this.externalPreviews)) {
      if (this.externalPreviews[name].closed) {
        delete this.externalPreviews[name];
      } else {
        this.externalPreviews[name].location.href = this.frame.src;
      }
    }
  }

  createWindow(name) {
    const childWindow = window.open(this.frame.src, '_blank');
    if (childWindow) {
      this.externalPreviews[name] = childWindow;
    } else {
      alert('Error: window was prevented from opening.');
    }
  }

  createExternalPreview() {
    if (this.frame && this.frame.src) {
      const name = `${document.title} Preview ${uuid()}`;
      this.createWindow(name);
    }
  }

  onLoad() {}
}

export { Preview };
