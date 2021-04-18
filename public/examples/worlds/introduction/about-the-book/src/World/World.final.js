import { createCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createSparkleHorse } from './components/SparkleHorse/sparkleHorse.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

let camera;
let controls;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);

    loop.updatables.push(controls);

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    const sparkleHorse = await createSparkleHorse();

    loop.updatables.push(sparkleHorse);
    scene.add(sparkleHorse);
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
