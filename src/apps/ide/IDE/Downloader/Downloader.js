import { saveAs } from 'file-saver';
import { generateNameFromPageTitle } from './utils/generateNameFromPageTitle.js';
import { UZIP } from './vendor/custom/UZIP.js';
import { readAsArrayBuffer } from './vendor/custom/readAs.js';
import { stringToUint8 } from './utils/stringToUint8';

class Downloader {
  constructor(files, assetsLocation) {
    this.files = files;
    this.assetsLocation = assetsLocation;
    // TODO: add an instructions file to the zip
  }

  async prepareFiles() {
    const zipFiles = {};
    const assets = [];
    for (const file of Object.values(this.files)) {
      if (file.dataType === 'text') {
        this.addTextFile(file, zipFiles);
      } else {
        assets.push(file);
      }
    }

    await this.addAssetsToZip(assets, zipFiles);

    return zipFiles;
  }

  addTextFile(file, zipFiles) {
    const text = file.getContentsWithImportStyle('cdn');
    zipFiles[`${file.url}`] = stringToUint8(text);
  }

  async addAssetsToZip(assets, zipFiles) {
    const fileData = await this.fetchAssets(assets);

    for (const [index, file] of assets.entries()) {
      zipFiles[`${file.url}`] = new Uint8Array(
        await readAsArrayBuffer(fileData[index]),
      );
    }
  }

  // TODO: this function is duplicated in Fetcher
  async fetchAssets(assets) {
    const filePromises = [];

    for (const file of assets) {
      const serverURL = file.url.replace(
        /assets\//g,
        this.assetsLocation,
      );

      filePromises.push(fetch(serverURL));
    }

    const responses = await Promise.all(filePromises);
    return Promise.all(responses.map((response) => response.blob()));
  }

  async downloadPackage() {
    const name = generateNameFromPageTitle();
    const zipFiles = await this.prepareFiles();

    const zipped = UZIP.encode(zipFiles, false);
    const blob = new Blob([zipped], { type: 'application/zip' });

    saveAs(blob, `${name}.zip`);
  }
}

export { Downloader };
