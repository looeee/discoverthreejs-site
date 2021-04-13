// Process array of URLS and return File objects

import { classifyURL } from '../utils/classifyURL.js';
import { fetchFiles } from './utils/fetchFiles.js';
import { File } from '../File/File.js';

class Fetcher {
  static async fetchFiles(
    urls,
    startURLS,
    finalURLS,
    serverDirectory,
    stripDirectory,
    comparisonsEnabled,
  ) {
    this.urls = urls;

    this.serverDirectory = serverDirectory;
    this.stripDirectory = stripDirectory;

    // fetch these
    const textURLs = [];

    // don't fetch these
    const assetURLs = [];

    for (const url of this.urls) {
      if (classifyURL(url) === 'text') {
        textURLs.push(url);
      } else {
        assetURLs.push(url);
      }
    }

    const textFiles = await this.fetchTextURLs(
      textURLs,
      comparisonsEnabled,
    );
    const assetFiles = this.processAssetsURLs(assetURLs);

    return { ...textFiles, ...assetFiles };
  }

  static async fetchTextURLs(urls, comparisonsEnabled) {
    const serverURLs = urls.map((url) =>
      `/${this.serverDirectory}/${url}`.replace(/\/\//g, '/'),
    );
    const textData = await fetchFiles(
      serverURLs,
      'text',
      this.serverDirectory,
    );

    const fileData = {};
    for (const [index, text] of textData.entries()) {
      fileData[urls[index].replace(this.stripDirectory, '')] = text;
    }

    const fileDataPaired = {};
    for (const [key, value] of Object.entries(fileData)) {
      if (key.includes('.start.js')) {
        fileDataPaired[key.replace('.start.js', '.js')] = {
          start: value,
          final: fileData[key.replace('.start.js', '.final.js')],
        };
      } else if (!key.includes('.final.js')) {
        fileDataPaired[key] = value;
      }
    }

    const results = {};
    for (const [key, text] of Object.entries(fileDataPaired)) {
      const url = key.replace(this.stripDirectory, ''); // maybe not required?
      results[url] = new File({
        url,
        text,
        serverDirectory: this.serverDirectory,
        comparisonsEnabled,
      });
    }
    return results;
  }

  static processAssetsURLs(urls) {
    const results = {};
    for (const url of urls) {
      results[url.replace(this.stripDirectory, '')] = new File({
        url,
        serverDirectory: this.serverDirectory,
      });
    }
    return results;
  }
}

export { Fetcher };
