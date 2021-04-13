import CodeMirror from 'codemirror';
import { getMimetype } from './utils/getMimetype.js';
import { classifyURL } from '../utils/classifyURL.js';
import { convertImportsInText } from './utils/convertImportsInText.js';
import { getNameFromURL } from './utils/getNameFromURL.js';

class File {
  constructor(data) {
    this.comparisonEnabled = data.comparisonsEnabled;
    this.deletable = data.deletable || false;
    this.name = getNameFromURL(data.url);

    this.url = data.url;
    this.type = data.url.split('.').pop();
    this.dataType = classifyURL(this.url);
    this.mimeType = getMimetype(this.type);

    if (this.dataType === 'text') {
      this.setupText(data.text);
    }

    this.serverURL = this.setServerURL(data.serverDirectory);

    this.importStyle = this.type === 'js' ? 'npm' : null;

    this.readOnly = !!this.url.includes('vendor');

    this.cmDoc = null;

    this.setState('start');
    this.inactiveStateHistory = null;
  }

  setupText(text) {
    if (this.readOnly || !this.comparisonEnabled) {
      // case one: comparison disabled, single text field OR readonly
      this.originalText = text || '';
      this.workingText = this.originalText;
    } else if (this.comparisonEnabled && !text.start) {
      // case two: comparison enabled, start and final texts are identical
      this.originalStartText = text || '';
      this.workingStartText = this.originalStartText;
      this.originalFinalText = text || '';
      this.workingFinalText = this.originalFinalText;
    } else {
      // case three: comparison enabled, start and final texts are different
      this.originalStartText = text.start || '';
      this.workingStartText = this.originalStartText;
      this.originalFinalText = text.final || '';
      this.workingFinalText = this.originalFinalText;
    }
  }

  // state = 'start' / 'final'
  setState(state) {
    this.state = state;

    if (!this.cmDoc) return;

    if (this.isDirty) {
      if (state === 'start') {
        this.workingFinalText = this.contents;
      } else {
        this.workingStartText = this.contents;
      }
    }

    const history = this.cmDoc.getHistory();
    const cursorPos = this.cmDoc.getCursor();

    this.cmDoc.setValue(this.activeText);
    this.cmDoc.clearHistory();

    this.cmDoc.setCursor(cursorPos);
    if (this.inactiveStateHistory) {
      this.cmDoc.setHistory(this.inactiveStateHistory);
    }

    this.inactiveStateHistory = history;

    if (state === 'start') {
      if (this.workingStartText === this.originalStartText) {
        this.cmDoc.markClean();
      }
    }

    if (state === 'final') {
      if (this.workingFinalText === this.originalFinalText) {
        this.cmDoc.markClean();
      }
    }
  }

  setServerURL(serverDirectory) {
    return `/${serverDirectory}/${this.url}`.replace(/\/\//g, '/');
  }

  get activeText() {
    if (!this.comparisonEnabled) {
      return this.workingText;
    } else if (this.state === 'start') {
      return this.workingStartText;
    }
    return this.workingFinalText;
  }

  get folder() {
    const res = this.url.split('/');
    res.pop();
    return res.join('/');
  }

  get document() {
    if (!this.cmDoc) {
      this.cmDoc = CodeMirror.Doc(this.activeText, this.mimeType);
    }
    return this.cmDoc;
  }

  get contents() {
    if (!this.cmDoc) {
      return this.activeText;
    }
    return this.document.getValue();
  }

  set contents(text) {
    this.document.setValue(text);
  }

  get isDirty() {
    if (!this.cmDoc) return false;
    else return !this.cmDoc.isClean();
  }

  reset() {
    if (!this.comparisonEnabled) {
      this.workingText = this.originalText;
    } else if (this.state === 'start') {
      this.workingStartText = this.originalStartText;
    } else {
      this.workingFinalText = this.originalFinalText;
    }
    if (this.cmDoc) {
      this.contents = this.activeText;
      this.cmDoc.markClean();
    }
  }

  getContentsWithImportStyle(style) {
    if (
      this.importStyle === style ||
      this.type !== 'js' ||
      this.url.indexOf('src') !== 0
    ) {
      return this.contents;
    }

    return convertImportsInText(
      this.contents,
      this.importStyle,
      style,
    );
  }

  setImportStyle(style) {
    if (
      this.type !== 'js' ||
      this.url.includes('vendor') ||
      this.importStyle === style
    ) {
      return;
    }

    this.workingText = convertImportsInText(
      this.workingText,
      this.importStyle,
      style,
    );
    this.workingStartText = convertImportsInText(
      this.workingStartText,
      this.importStyle,
      style,
    );
    this.workingFinalText = convertImportsInText(
      this.workingFinalText,
      this.importStyle,
      style,
    );

    if (this.cmDoc) {
      this.contents = convertImportsInText(
        this.contents,
        this.importStyle,
        style,
      );
    }

    this.importStyle = style;
  }
}

export { File };
