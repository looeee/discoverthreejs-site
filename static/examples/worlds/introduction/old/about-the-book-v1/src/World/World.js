import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createSparkleHorse } from './components/SparkleHorse/sparkleHorse.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { update } from './systems/update.js';

let scene;
let camera;
let controls;
let renderer;

const updatables = [];

class World {
  constructor() {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();

    controls = createControls(camera, renderer.domElement);

    const { ambientLight, mainLight } = createLights();

    updatables.push(controls);

    scene.add(ambientLight, mainLight);

    this.canvas = renderer.domElement;
  }

  async init() {
    const sparkleHorse = await createSparkleHorse();

    updatables.push(sparkleHorse);
    scene.add(sparkleHorse);
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

      renderer.render(scene, camera);
    });
  }
}

export { World };
