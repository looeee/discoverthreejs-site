function validateFileName(name) {
  const validExtensions = ['js', 'css', 'html'];

  if (!name.includes('.')) {
    return false;
    // return true; // return true to enable empty folders (buggy)
  } else if (validExtensions.includes(name.split('.').pop())) {
    return true;
  }
  return false;
}

export { validateFileName };
