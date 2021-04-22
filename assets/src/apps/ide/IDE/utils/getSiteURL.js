function getSiteURL() {
  return window.location.href
    .replace(window.location.pathname, '')
    .replace(window.location.hash, '');
}

export { getSiteURL };
