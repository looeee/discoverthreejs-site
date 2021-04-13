import { Reset } from './Reset.js';

class Controls {
  static setupResetButtons(editor) {
    return new Reset(editor);
  }

  static setupDownloadPackageButton(downloader) {
    const downloadButton = document.querySelector('#download-button');

    downloadButton.addEventListener('click', () => {
      downloader.downloadPackage();
    });
  }

  static setupImportStyleSelect(files, enabled) {
    if (enabled !== 'true') {
      return;
    }
    const selectMenu = document.querySelector('#select-import-style');
    selectMenu.disabled = false;

    selectMenu.addEventListener('change', (e) => {
      const value = e.target.options[e.target.selectedIndex].value;

      for (const file of Object.values(files)) {
        file.setImportStyle(value);
      }
    });
  }

  static openPreviewInNewWindow(preview) {
    const newWindowPreviewButton = document.querySelector(
      '#new-window-preview',
    );

    newWindowPreviewButton.addEventListener('click', () => {
      preview.createExternalPreview();
      newWindowPreviewButton.blur();
    });
  }

  static setupStartFinalCodeToggle(editor) {
    const toggle = document.querySelector('#toggle-complete');
    toggle.disabled = false;
    toggle.addEventListener('click', (e) => {
      if (e.target.checked) {
        editor.setComparisonState('final');
      } else {
        editor.setComparisonState('start');
      }
      editor.focus();
    });
  }
}

export { Controls };
