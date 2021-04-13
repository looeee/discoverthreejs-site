function getMimetype(type) {
  switch (type) {
    case 'html':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'text/javascript';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'glb':
      return 'model/gltf-binary';
    default:
      return 'text/plain';
  }
}

export { getMimetype };
