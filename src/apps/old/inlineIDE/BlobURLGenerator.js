import getRegexMatches from './utils/getRegexMatches.js';
import importURLConverter from './utils/importURLConverter.js';
import getMimetype from './utils/getMimetype.js';

export default class BlobURLGenerator {
  constructor(files, editor) {
    this.files = files;
    this.editor = editor;
  }

  generateSrcURL() {
    if (!this.files['index.html']) {
      return this.createBlobURL(
        'index.html not found!',
        getMimetype('html'),
      );
    }

    return this.generateFileURL(this.files['index.html']);
  }

  generateFileURL(file) {
    switch (file.type) {
      case 'html':
        return this.generateHtmlURL(file);
      case 'css':
        return this.generateCssURL(file);
      case 'js':
        return this.generateJsURL(file);
      default:
        return this.createBlobURL(
          `File type ".${file.type} is unknown`,
        );
    }
  }

  generateHtmlURL(file) {
    const parser = new DOMParser();
    const document = parser.parseFromString(
      this.editor.getFileContents(file),
      getMimetype(file.type),
    );

    const styles = document.querySelectorAll(
      'link[rel="stylesheet"]',
    );

    styles.forEach(style => {
      const cssFile = this.files[style.getAttribute('href')];
      if (cssFile) style.href = this.generateFileURL(cssFile);
    });

    const scripts = document.querySelectorAll('script');
    for (const script of scripts) {
      const jsFile = this.files[script.getAttribute('src')];
      if (jsFile) script.src = this.generateFileURL(jsFile);
    }

    const serializer = new XMLSerializer();

    const htmlString = serializer.serializeToString(document);

    return this.createBlobURL(htmlString, 'text/html');
  }

  generateCssURL(file) {
    return this.createBlobURL(
      this.editor.getFileContents(file),
      getMimetype(file.type),
    );
  }

  // TODO handle multiple imports from the same file
  generateJsURL(file) {
    const currentURL = file.url.substring(
      0,
      file.url.lastIndexOf('/') + 1,
    );

    let text = this.editor.getFileContents(file);
    const importURLs = getRegexMatches(
      text,
      /\b\s*from\s*['"](.*?)['"]/g,
      1,
    );
    const convertedURLs = importURLs.map(url =>
      importURLConverter(url, currentURL),
    );

    for (const [i, url] of convertedURLs.entries()) {
      if (this.files[url]) {
        const blobURL = this.generateFileURL(this.files[url]);

        text = text.replace(importURLs[i], blobURL);
      }
    }

    const processedURL = this.createBlobURL(
      text,
      getMimetype(file.type),
    );

    return processedURL;
  }

  createBlobURL(code, type) {
    const blob = new Blob([code], { type });
    return URL.createObjectURL(blob);
  }
}
