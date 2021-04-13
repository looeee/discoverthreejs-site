function getNameFromURL(url) {
  const list = url.split('/');

  return list[list.length - 1];
}

export { getNameFromURL };
