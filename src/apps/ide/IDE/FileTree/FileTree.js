import { buildFileTree } from './buildFileTree.js';
import { File } from '../File/File.js';
import { sanitiseFileName } from './utils/sanitiseFileName.js';

class FileTree {
  constructor(
    files,
    fileTypes,
    closedFolders = [],
    editor,
    imagePreview,
    comparisonsEnabled,
  ) {
    this.files = files;
    this.fileTypes = fileTypes;
    this.closedFolders = closedFolders;
    this.editor = editor;
    this.imagePreview = imagePreview;
    this.currentFolder = '';
    this.currentFile = null;
    this.comparisonsEnabled = comparisonsEnabled;

    this.init();

    this.setupCreateFileButton();
    this.setupDeleteFileButton();
  }

  dispose() {
    this.tree.dispose();
  }

  init() {
    this.tree = this.buildTree();
    this.setupOnSelect();
  }

  buildTree() {
    return buildFileTree(
      this.files,
      this.fileTypes,
      this.closedFolders,
    );
  }

  setEventCallback(eventType, callback) {
    this.tree.on(eventType, callback);
  }

  setSelectedFile(file) {
    this.onSelectFile(file);
    this.currentFolder = file.folder;

    this.tree.selectNodeByPath(file.url);
  }

  selectItem(item) {
    this.currentFolder = item.folder;
    if (item.file) {
      this.onSelectFile(item.file);
    } else {
      this.currentFile = null;
    }
  }

  onSelectFile(file) {
    switch (file.type) {
      case 'js':
      case 'html':
      case 'css':
        this.onSelectTextFile(file);
        break;
      case 'png':
      case 'jpg':
        this.onSelectImage(file);
        break;
      case 'glb':
        this.onSelectModel(file);
        break;
      default:
        // other file types: do nothing for now
        break;
    }
    this.currentFile = file;
    this.setControlsState(file);
  }

  onSelectModel(file) {
    // TODO
  }

  onSelectImage(file) {
    this.editor.container.classList.add('show-image');
    this.imagePreview.src = file.serverURL;
  }

  onSelectTextFile(file) {
    // if (file.deletable) {}
    this.editor.container.classList.remove('show-image');
    this.editor.setActiveDocument(file);
  }

  setupOnSelect() {
    this.tree.onSelect(this.selectItem.bind(this));
  }

  setControlsState(file) {
    if (file && file.deletable && !(file.type === 'folder')) {
      this.deleteFileButton.disabled = false;
    } else {
      this.deleteFileButton.disabled = true;
    }
  }

  createFile() {
    const defaultText =
      this.currentFolder === 'styles' ? 'file.css' : 'file.js';

    // https://github.com/janmarkuslanger/attention.js/
    // https://github.com/makeusabrew/bootbox
    const name = prompt(
      'Enter a file name with extension .js, .html, or .css. \nInclude slashes (folder/file.js) to create folders.',
      defaultText,
    );
    if (!name) return;

    const sanitisedName = sanitiseFileName(name);

    if (!sanitisedName) {
      alert('Invalid file name!');
      return;
    }

    const url = this.currentFolder
      ? `${this.currentFolder}/${sanitisedName}`
      : name;

    const data = {
      url,
      text: '',
      deletable: true,
    };

    data.type = name.includes('.') ? name.split('.').pop() : 'folder';
    data.comparisonsEnabled = this.comparisonsEnabled;

    const file = new File(data);

    this.files[data.url] = file;
    return file;
  }

  deleteFile(file) {
    delete this.files[file.url];
  }

  setupCreateFileButton() {
    // TODO-HIGH: onload file is created at root even when other directory is selected
    const button = document.querySelector('#create-file-button');

    button.addEventListener('click', (e) => {
      e.preventDefault();
      const file = this.createFile();
      button.blur();
      if (!file) return;
      this.dispose();
      this.init();
      this.setSelectedFile(file);
    });
  }

  setupDeleteFileButton() {
    this.deleteFileButton = document.querySelector(
      '#delete-file-button',
    );

    this.deleteFileButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this.currentFile) {
        return;
      }
      this.deleteFile(this.currentFile);
      this.dispose();
      this.init();
      this.setControlsState();
      this.currentFolder = '';
      this.editor.setActiveDocument(null);
    });
  }
}

export { FileTree };
