import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createCube } from './components/cube.js';
import { createScene } from './components/scene.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { update } from './systems/update.js';

let scene;
let camera;
let renderer;

const updatables = [];

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    container.append(renderer.domElement);

    const cube = createCube();
    const light = createLights();

    updatables.push(cube);

    scene.add(cube, light);

    const resizer = new Resizer(container, camera, renderer);
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
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
