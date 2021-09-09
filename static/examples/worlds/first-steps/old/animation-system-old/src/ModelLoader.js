import { AnimationMixer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class ModelLoader {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
  }

  setupAnimation(model, clip) {
    const mixer = new AnimationMixer(model);
    const action = mixer.clipAction(clip);
    action.play();

    model.userData.update = (delta) => mixer.update(delta);
  }

  // Called when a glTF file has finished loading
  onLoad(gltf, position) {
    const model = gltf.scene.children[0];
    const clip = gltf.animations[0];

    model.position.copy(position);

    this.setupAnimation(model, clip);

    this.scene.add(model);
  }

  // log any error messages to the console
  onError(message) {
    console.error(message);
  }

  load(url, position) {
    this.loader.load(
      url,
      (gltf) => this.onLoad(gltf, position),
      null,
      this.onError
    );
  }
}

export { ModelLoader };
