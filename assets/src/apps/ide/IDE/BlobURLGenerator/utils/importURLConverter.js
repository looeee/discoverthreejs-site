// TODO-HIGH this should be done by the File class probably.

// replace urls that start with ./ or ../ with abs url based on current dir
// leave all other urls unchanged
function importURLConverter(url, currentURL) {
  if (url.indexOf("./") === 0) return url.replace("./", currentURL);

  if (url.indexOf("../") === 0) {
    const currentURLParts = currentURL.split("/").filter(String);

    while (url.indexOf("../") === 0) {
      if (currentURLParts.length === 0) {
        console.error(
          `Could not resolve import ${url} relative to ${currentURL}`
        );
        return "";
      }
      url = url.replace("../", "");

      currentURLParts.pop();
    }

    return currentURLParts.length ? currentURLParts.join("/") + "/" + url : url;
  }

  return url;
}

export { importURLConverter };
