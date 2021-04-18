import { createCamera } from './components/camera.js';
import { createCube } from './components/cube.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

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

    const cube = createCube();
    const light = createLights();

    updatables.push(cube);

    scene.add(cube, light);

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
