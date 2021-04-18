import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createMeshGroup } from './components/meshGroup.js';
import { createScene } from './components/scene.js';

import { createRenderer } from './systems/renderer.js';
import { createControls } from './systems/controls.js';
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

    const meshGroup = createMeshGroup();

    updatables.push(controls, meshGroup);

    scene.add(ambientLight, mainLight, meshGroup);

    const resizer = new Resizer(container, camera, renderer);
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    renderer.setAnimationLoop(() => {
      update(updatables);

      this.render();
    });
  }
}

export { World };
