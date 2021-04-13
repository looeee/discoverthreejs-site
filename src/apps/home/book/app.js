import { App } from './vendor/App.js';

import { setupRenderer } from './systems/renderer.js';
import { setupCamera } from './components/camera.js';
import { setupControls } from './systems/controls.js';

import { setZoomFromWindow } from './utility/setZoomFromWindow.js';

import { playWhileOnScreen } from './utility/playWhileOnScreen.js';

function createApp() {
  const app = new App({
    container: '#hero-container',
    renderer: {
      alpha: true,
    },
  });

  app.init();

  setupRenderer(app.renderer);
  setupCamera(app.camera);
  setupControls(app.controls);

  setZoomFromWindow(app.camera, app.controls);

  playWhileOnScreen(app);

  return app;
}

export { createApp };
