function generateNameFromPageTitle() {
  return document.title
    .split('|')[0]
    .trim()
    .replace(/ /g, '_')
    .replace(/[^a-z0-9_]/gi, '');
}

export { generateNameFromPageTitle };
