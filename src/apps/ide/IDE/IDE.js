import { BlobURLGenerator } from './BlobURLGenerator/BlobURLGenerator.js';
import { Editor } from './Editor/Editor.js';
import { Fetcher } from './Fetcher/Fetcher.js';
import { FileTree } from './FileTree/FileTree.js';
import { Preview } from './Preview/Preview.js';
import { Controls } from './Controls/Controls.js';
import { setupPanels } from './Panels/setupPanels.js';
import { Downloader } from './Downloader/Downloader.js';
import { getSiteURL } from './utils/getSiteURL.js';

// NOTES:
// load from directory structure like
//
// /assets
//  -> /model
//  -> /textures
// /vendor
//  -> three
// /styles
// /worlds
//  -> chapter_01
//  -> -> src
//  -> -> index.html
//
// All worlds can share nearly all files, and differences are placed under worlds/
// then the path /worlds/chapter_01/ can be hidden from the user when loaded in the IDE to keep things clean

class IDE {
  constructor(config) {
    this.config = config;
    this.config.siteURL = getSiteURL();
    this.config.assetsLocation = `${this.config.siteURL}/${this.config.serverDirectory}/assets/`;

    this.fileTypes = ['.js', '.html', '.css', '.glb', '.png', '.jpg'];
    this.textTypes = ['js', 'html', 'css'];
    this.imageTypes = ['png', 'jpg'];
    this.otherTypes = ['glb'];

    this.comparisonsEnabled =
      this.config.comparisonMode.toLowerCase() === 'true';

    this.container = document.querySelector(config.container);
  }

  async init() {
    this.files = await Fetcher.fetchFiles(
      this.config.files,
      this.config.startFiles,
      this.config.finalFiles,
      this.config.serverDirectory,
      this.config.stripDirectory,
      this.comparisonsEnabled,
    );

    this.editor = new Editor(this.files);
    this.preview = new Preview();
    this.imagePreview = document.querySelector('#image-preview');

    this.fileTree = new FileTree(
      this.files,
      this.fileTypes,
      this.config.closedFolders,
      this.editor,
      this.imagePreview,
      this.comparisonsEnabled,
    );

    this.urlGenerator = new BlobURLGenerator(
      this.files,
      this.config.assetsLocation,
      this.config.entry,
    );

    if (this.config.activeDocument) {
      this.setActiveDocument(this.config.activeDocument);
    }

    this.preview.update(this.urlGenerator.generateSrcURL());
    this.downloader = new Downloader(
      this.files,
      this.config.assetsLocation,
    );

    this.setupControls();
    this.setupEvents();

    setupPanels(this, this.config.fullScreen);
  }

  setActiveDocument(doc) {
    this.editor.setActiveDocument(this.files[doc]);
    this.fileTree.setSelectedFile(this.files[doc]);
  }

  setupEvents() {
    // wait until typing stops for a certain time, then refresh
    let refreshCountDown;

    this.editor.setEventCallback('changes', () => {
      clearTimeout(refreshCountDown);

      refreshCountDown = setTimeout(() => this.updatePreview(), 700);

      this.resetControls.setButtonStates();
    });

    this.editor.setEventCallback('refresh', () => {
      this.resetControls.setButtonStates();
    });
  }

  setupControls() {
    Controls.setupDownloadPackageButton(this.downloader);
    Controls.setupImportStyleSelect(
      this.files,
      this.config.switchImportsAllowed,
    );
    Controls.openPreviewInNewWindow(this.preview);

    this.resetControls = Controls.setupResetButtons(this.editor);

    if (this.comparisonsEnabled) {
      Controls.setupStartFinalCodeToggle(this.editor);
    }
  }

  updatePreview() {
    this.preview.update(this.urlGenerator.generateSrcURL());
  }

  update() {
    this.updatePreview();
    this.editor.refresh();
  }
}

export { IDE };
