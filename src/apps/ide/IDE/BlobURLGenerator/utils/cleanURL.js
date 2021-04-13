const cleanURL = (url) => {
  return url
    .replace(/(\.\.\/)/g, '')
    .replace(/^(\.\/)/, '')
    .replace(/^(\/)/, '');
}

export { cleanURL }