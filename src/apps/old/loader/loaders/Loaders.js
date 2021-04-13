import onGLTFLoad from './onGLTFLoad';
import onFBXLoad from './onFBXLoad';
import onDAELoad from './onDAELoad';

import asyncLoader from '../utility/asyncLoader';

THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

export default class Loaders {
  constructor(app, meshes, camera) {
    this.app = app;
    this.meshes = meshes;
    this.camera = camera;

    this.initLoaders();
  }

  initLoaders() {
    THREE.DRACOLoader.setDecoderPath(
      'https://threejs.org/examples/js/libs/draco/gltf/',
    );
    this.app.loader.setDRACOLoader(new THREE.DRACOLoader());

    this.gltfLoader = asyncLoader(this.app.loader);
    this.fbxLoader = asyncLoader(new THREE.FBXLoader());
    this.daeLoader = asyncLoader(new THREE.ColladaLoader());
  }

  async loadFile(file, loader, onLoad) {
    try {
      const result = await loader(file);

      console.log('Loaded Object: ', result);
      this.meshes.add(onLoad(result, this.app));
      this.camera.fitToLoadedObjects();
    } catch (err) {
      console.log(err);
    }
  }

  loadGLTF(file) {
    this.loadFile(file, this.gltfLoader, onGLTFLoad);
  }

  loadFBX(file) {
    this.loadFile(file, this.fbxLoader, onFBXLoad);
  }

  loadDAE(file) {
    this.loadFile(file, this.daeLoader, onDAELoad);
  }
}
