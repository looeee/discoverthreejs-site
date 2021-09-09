import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class ModelLoader {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
  }

  // Called when a glTF file has finished loading
  onLoad(gltfData, position) {
    const model = gltfData.scene.children[0];
    model.position.copy(position);

    this.scene.add(model);
  }

  // the loader will report the loading progress to this function
  onProgress() {
    // nothing here for now
  }

  // log any error messages to the console
  onError(message) {
    console.error(message);
  }

  load(url, position) {
    this.loader.load(
      url,
      (gltfData) => this.onLoad(gltfData, position),
      this.onProgress,
      this.onError
    );
  }
}

export { ModelLoader };
