import {
  DirectionalLightHelper,
  SpotLightHelper,
  CameraHelper,
} from 'three';

function createLightHelper(light) {
  if (light.isSpotLight) return new SpotLightHelper(light);
  if (light.isDirectionalLight)
    return new DirectionalLightHelper(light);
  return null;
}

function createShadowHelper(light) {
  const shadowHelper = new CameraHelper(light.shadow.camera);

  return shadowHelper;
}

export function createHelpers(lights) {
  return {
    mainLightHelper: createLightHelper(lights.main),
    mainLightShadowHelper: createShadowHelper(lights.main),
  };
}
