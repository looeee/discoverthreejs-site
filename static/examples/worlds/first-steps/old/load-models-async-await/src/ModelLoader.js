import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader();
  }

  load(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(url, (gltfData) => resolve(gltfData), null, reject);
    });
  }

  async loadModels(urls) {
    const promises = urls.map((url) =>
      this.load(url).catch((errorData) => {
        return {
          status: "failed",
          errorData,
        };
      })
    );

    return Promise.all(promises);
  }
}

export { ModelLoader };
