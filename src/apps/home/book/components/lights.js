import { HemisphereLight, DirectionalLight } from 'three';

function createHemisphereLight() {
  // const hemiLight = new HemisphereLight( 0x7c849b, 0xd7cbb1, 0.2 );
  // hemiLight.position.set( 0, 0.10, -0.02 );

  return new HemisphereLight(
    0xae9a7f,
    0x6d6e73,

    // full moon
    // 0.3,

    // twilight
    5,

    // very dark overcast sky
    // 100,

    // sunset/rise, clear sky
    // 400,

    // overcast day
    // 1000,

    // normal daylight
    // 10000,

    // direct sun
    // 50000,
  );
}

function createDirectionalLight() {
  const light = new DirectionalLight(0xffffee, 40);

  light.position.set(-0.12, 0.6, -0.09);

  light.castShadow = true;

  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default

  light.shadow.camera.near = 0.8;
  light.shadow.camera.far = 1.4;

  light.shadow.camera.top = 0.4;
  light.shadow.camera.bottom = -0.3;
  light.shadow.camera.left = -0.35;
  light.shadow.camera.right = 0.35;

  light.shadow.radius = 3;

  light.shadow.bias = -0.0008;

  return light;
}

function createLights() {
  return {
    ambient: createHemisphereLight(),
    main: createDirectionalLight(),
  };
}

export { createLights };
