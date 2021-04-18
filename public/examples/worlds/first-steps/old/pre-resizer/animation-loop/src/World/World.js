import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createCube } from './components/cube.js';
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
    // Set the camera's aspect ratio
    camera.aspect = width / height;

    // update the camera's frustum
    camera.updateProjectionMatrix();

    // update the size of the renderer AND the canvas
    renderer.setSize(width, height);

    // set the pixel ratio (for mobile devices)
    renderer.setPixelRatio(pixelRatio);
  }

  start() {
    // start the animation loop
    // everything inside here will run once per frame
    renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      update(updatables);

      // then draw a frame
      this.render();
    });
  }
}

export { World };
