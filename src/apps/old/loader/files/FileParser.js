const isAsset = (type) =>
  type.match('(png|jpg|jpeg|gif|bmp|dds|bin|vert|frag)$');

const isModel = (type) => type.match('(fbx|gltf|glb|dae)$');

const isValid = (type) => isAsset(type) || isModel(type);

const getType = (filename) => filename.split('.').pop().toLowerCase();

export default class FileParser {
  constructor(app, loaders) {
    this.loaders = loaders;
  }

  onLoad(result, type) {
    switch (type) {
      case 'fbx':
        this.loaders.loadFBX(result);
        break;

      case 'gltf':
      case 'glb':
        this.loaders.loadGLTF(result);
        break;

      case 'dae':
        this.loaders.loadDAE(result);
        break;

      default:
        break;
    }
  }

  parse(files) {
    files.forEach(async (file) => {
      const type = getType(file.name);

      console.log(type);

      const reader = new FileReader();

      reader.onload = (e) => this.onLoad(e.target.result, type);
      reader.onerror = (e) =>
        console.error('Error reading ' + file.name);
      reader.readAsDataURL(file);
    });
  }
}
