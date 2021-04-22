import { Panels } from './Panels.js';
import { createPanelConfig } from './createPanelConfig.js';
import { OrientationControl } from './orientationControl.js';

let panels;
let layout;
let orientationControls;
let fullScreen;

const initPanels = () => {
  const newLayout = orientationControls.getLayout();

  if (newLayout === layout && panels) return;

  layout = newLayout;

  panels.dispose();

  const config = createPanelConfig(layout, fullScreen);
  panels.init(config);
};

function setupPanels(ide, isFullScreen) {
  fullScreen = isFullScreen;
  orientationControls = new OrientationControl();

  panels = new Panels(ide);

  initPanels();

  window.addEventListener('resize', initPanels);

  if (!fullScreen) {
    orientationControls.onChange = initPanels;
  }
}

export { setupPanels };
