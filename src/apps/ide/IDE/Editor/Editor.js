import { setupCodeMirror } from './setupCodeMirror.js';

// import { getMimetype } from '../File/utils/getMimetype';
import { HTMLBuilder } from '../HTML/HTMLBuilder.js';

class Editor {
  constructor(files) {
    this.files = files;
    this.activeFile = null;
    this.fileDirty = false;

    const textArea = HTMLBuilder.buildEditor();

    this.cm = setupCodeMirror(textArea);
    this.container = document.querySelector('.CodeMirror');
  }

  get isDirty() {
    return Object.values(this.files).some((file) => {
      return file.isDirty;
    });
  }

  setActiveDocument(file) {
    this.activeFile = file;

    if (file === null) {
      // NOTE: there doesn't seem to be any CodeMirror commands to delete a doc
      // this is the only approach possible. Hopefully no memory leaks!
      this.cm.setValue('');
      this.cm.clearHistory();
      this.setReadOnly(true);
      this.cm.display.input.blur();
    } else if (file.document) {
      this.cm.swapDoc(file.document);
      this.cm.refresh();
      this.setReadOnly(file.readOnly);
      this.focus();
    } else {
      console.warn(`Editor could not open file: ${file}`);
    }
  }

  setEventCallback(eventType, callback) {
    this.cm.on(eventType, callback);
  }

  resetActiveFile() {
    if (this.activeFile) {
      this.activeFile.reset();
    }
  }

  resetAllFiles() {
    Object.values(this.files).forEach((file) => {
      file.reset();
    });
  }

  refresh() {
    if (this.cm) {
      this.cm.refresh();
    }
  }

  focus() {
    if (this.cm) this.cm.focus();
  }

  setReadOnly(bool) {
    this.cm.setOption('readOnly', bool);
    if (bool) {
      this.container.classList.add('read-only');
    } else {
      this.container.classList.remove('read-only');
    }
  }

  setComparisonState(state) {
    for (const file of Object.values(this.files)) {
      if (file.comparisonEnabled) {
        file.setState(state);
      }
    }
    this.setActiveDocument(this.activeFile);
  }
}

export { Editor };
