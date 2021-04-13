import { VSMShadowMap } from 'three';

function setupRenderer(renderer) {
  renderer.toneMappingExposure = 0.11;

  renderer.shadowMap.enabled = true;
  renderer.sortObjects = false;

  renderer.shadowMap.type = VSMShadowMap;
}

export { setupRenderer };
