import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { Train } from './components/Train/Train.js';

import { createControls } from './systems/controls.js';
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

    const controls = createControls(camera, renderer.domElement);

    const { ambientLight, mainLight } = createLights();

    const train = new Train();

    updatables.push(controls);

    scene.add(ambientLight, mainLight, train);

    const resizer = new Resizer(container, camera, renderer);
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
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
