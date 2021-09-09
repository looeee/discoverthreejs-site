import { REVISION } from "three/src/constants.js";
import { getSiteURL } from "../utils/getSiteURL.js";
import { cleanURL } from "./utils/cleanURL.js";
import { getRegexMatches } from "./utils/getRegexMatches.js";
import { importURLConverter } from "./utils/importURLConverter.js";

class BlobURLGenerator {
  constructor(files, assetsLocation, entry) {
    this.files = files;
    this.assetsLocation = assetsLocation;
    this.vendorLocation = assetsLocation.replace("assets", "vendor");
    this.entry = entry;
  }

  generateSrcURL() {
    if (!this.files[this.entry]) {
      return this.createBlobURL("entry file not found!", "text/html");
    }

    return this.generateFileURL(this.files[this.entry]);
  }

  generateFileURL(file) {
    switch (file.type) {
      case "html":
        return this.generateHtmlURL(file);
      case "css":
        return this.generateCssURL(file);
      case "js":
        return this.generateJsURL(file);
      default:
        return this.createBlobURL(`File type ".${file.type} is unknown`);
    }
  }

  generateHtmlURL(file) {
    const parser = new DOMParser();
    const document = parser.parseFromString(file.contents, file.mimeType);

    const styles = document.querySelectorAll('link[rel="stylesheet"]');

    styles.forEach((style) => {
      const ref = cleanURL(style.getAttribute("href"));
      const cssFile = this.files[ref];
      if (cssFile) style.href = this.generateFileURL(cssFile);
    });

    const scriptTags = document.querySelectorAll("script");

    scriptTags.forEach((script) => {
      const src = script.getAttribute("src");
      if (!src) return;
      const ref = cleanURL(src);
      const jsFile = this.files[ref];
      if (jsFile) script.src = this.generateFileURL(jsFile);
    });

    const serializer = new XMLSerializer();

    const htmlString = serializer.serializeToString(document);

    return this.createBlobURL(htmlString, "text/html");
  }

  generateCssURL(file) {
    return this.createBlobURL(file.contents, file.mimeType);
  }

  // TODO handle multiple imports from the same file
  generateJsURL(file) {
    const currentURL = file.url.substring(0, file.url.lastIndexOf("/") + 1);

    let text = file.contents;

    const importURLs = getRegexMatches(text, /\b\s*from\s*['"](.*?)['"]/g, 1);

    const convertedURLs = importURLs.map((url) => {
      if (!url.includes("from 'three")) {
        return importURLConverter(url, currentURL);
      }
    });

    convertedURLs.forEach((url, i) => {
      if (this.files[url]) {
        const blobURL = this.generateFileURL(this.files[url]);

        text = text.replace(importURLs[i], blobURL);
      }
    });

    text = this.replaceAssetsURLs(text);
    text = this.replaceVendorURLs(text);

    const processedURL = this.createBlobURL(text, file.mimeType);

    return processedURL;
  }

  replaceVendorURLs(text) {
    let newText = text.replace(
      /from 'three/gi,
      `from 'https://cdn.skypack.dev/three@0.${REVISION}.2`
    );
    return newText;
  }

  // replace all assets urls with direct url to the server
  // TODO: this function is duplicated in Downloader
  replaceAssetsURLs(text) {
    const serverURL = text.replace(/\/assets\//g, this.assetsLocation);

    return serverURL;
  }

  createBlobURL(code, type) {
    const blob = new Blob([code], {
      type,
    });
    return URL.createObjectURL(blob);
  }
}

export { BlobURLGenerator };
