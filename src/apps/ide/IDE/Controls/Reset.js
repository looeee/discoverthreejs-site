class Reset {
  constructor(editor) {
    this.editor = editor;
    this.resetActiveFileButton = document.querySelector(
      '#reset-active-file',
    );
    this.resetAllButton = document.querySelector('#reset-all-files');

    this.setupResetActiveButton();
    this.setupResetAllButton();
  }

  setButtonStates() {
    this.resetActiveFileButton.disabled =
      !!this.editor.activeFile && !this.editor.activeFile.isDirty;
    this.resetAllButton.disabled = !this.editor.isDirty;
  }

  setupResetActiveButton() {
    this.resetActiveFileButton.addEventListener('click', () => {
      this.editor.resetActiveFile();
      this.setButtonStates();
    });
  }

  setupResetAllButton() {
    this.resetAllButton.addEventListener('click', () => {
      this.editor.resetAllFiles();
      this.setButtonStates();
    });
  }
}

export { Reset };
