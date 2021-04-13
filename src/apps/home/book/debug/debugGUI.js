import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { setupLightsDebugFolder } from './GUIFolders/lightsDebugFolder.js';
import { setupShadowsDebugFolder } from './GUIFolders/shadowsDebugFolder.js';
import { setupRendererDebugFolder } from './GUIFolders/rendererDebugFolder.js';
import { setupMaterialsDebugFolder } from './GUIFolders/materialsDebugFolder.js';
// import {setupPostDebugFolder} from './GUIFolders/postDebugFolder.js';
// import {setupModelsDebugFolder} from './GUIFolders/modelsDebugFolder.js';

export function setupDebugGUI(app, lights, materials) {
  const gui = new GUI();

  setupRendererDebugFolder(gui, app.renderer);

  setupLightsDebugFolder(gui, lights);

  setupShadowsDebugFolder(gui, lights);

  // setupModelsDebugFolder( gui, models );

  setupMaterialsDebugFolder(gui, materials.book);

  // setupCameraDebugFolder( gui, app.camera, app.controls );

  // setupPostDebugFolder( gui, passes );
}
