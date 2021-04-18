import { WebGLRenderer } from 'three';

function createRenderer() {
  const renderer = new WebGLRenderer();

  renderer.physicallyCorrectLights = true;

  return renderer;
}

export { createRenderer };
