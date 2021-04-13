const textURLS = ['css', 'html', 'js', 'json'];
const imageURLS = ['jpg', 'png'];
const modelsURLS = ['glb'];

function classifyURL(url) {
  const ext = url.split('.').pop();

  if (textURLS.includes(ext)) {
    return 'text';
  } else if (imageURLS.includes(ext)) {
    return 'image';
  } else if (modelsURLS.includes(ext)) {
    return 'model';
  }
  return 'text';
}

export { classifyURL };
