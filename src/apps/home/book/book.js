// import { Cache } from 'three';

import { createApp } from './app.js';

import { createLights } from './components/lights.js';

import { createGeometries } from './components/geometries.js';
import { createMaterials } from './components/materials.js';
import { createMeshes } from './components/meshes.js';

// import {loadEnvironment} from './environment.js';
import { loadGLTFModels } from './components/models.js';
import { loadTextures } from './components/textures.js';

import { setupAnimation } from './systems/animation.js';

// import {createHelpers} from './debug/helpers.js';
// import {setupDebugGUI} from './debug/debugGUI.js';

// Cache.enabled = true;

async function initScene() {
  const app = createApp();
  app.start();

  // loadEnvironment(app);
  const textures = loadTextures();

  const lights = createLights();

  const geometries = createGeometries();
  const materials = createMaterials(textures);
  const meshes = createMeshes(geometries, materials);

  const models = await loadGLTFModels(materials);
  document.querySelector('.loading').classList.add('fade-out');

  setupAnimation(models);

  // const helpers = createHelpers(lights);

  app.camera.add(lights.main);

  app.scene.add(
    // lights.ambient,
    // lights.main,
    app.camera,

    meshes.ground.reflection,
    meshes.ground.shadow,

    models.birds.parrot,
    models.birds.flamingo,
    models.birds.stork,

    models.book.cover,
    models.book.pages,

    models.book.coverShadow,
    // models.book.pagesShadow,

    // helpers.mainLightHelper,
    // helpers.mainLightShadowHelper,
  );

  // setupDebugGUI(app, lights, materials);

  app.onWindowResize();
}

export { initScene };
