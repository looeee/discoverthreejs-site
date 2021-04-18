import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { Train } from './components/Train/Train.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { update } from './systems/update.js';

let scene;
let camera;
let renderer;

const updatables = [];

class World {
  constructor() {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();

    const controls = createControls(camera, renderer.domElement);

    const { ambientLight, mainLight } = createLights();

    const train = new Train();

    updatables.push(controls);

    scene.add(ambientLight, mainLight, train);

    this.canvas = renderer.domElement;
  }

  // draw a single frame
  render() {
    renderer.render(scene, camera);
  }

  setSize(width, height, pixelRatio) {
    camera.aspect = width / height;

    // update the camera's frustum
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

    renderer.setPixelRatio(pixelRatio);
  }

  start() {
    // everything inside here will run once per frame
    renderer.setAnimationLoop(() => {
      update(updatables);

      this.render();
    });
  }
}

export { World };
