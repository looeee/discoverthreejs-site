import { loadBirds } from './components/birds/birds.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { update } from './systems/update.js';

let scene;
let camera;
let controls;
let renderer;

const updatables = [];

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement);

    const { ambientLight, mainLight } = createLights();

    updatables.push(controls);

    scene.add(ambientLight, mainLight);

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    const { parrot, flamingo, stork } = await loadBirds();

    // move the target to the center of the front bird
    controls.target.copy(parrot.position);

    updatables.push(parrot, flamingo, stork);

    scene.add(parrot, flamingo, stork);
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
