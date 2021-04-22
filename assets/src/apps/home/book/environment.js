import {
  CubeTextureLoader,
  CubeReflectionMapping,
  PMREMGenerator,
  sRGBEncoding,
  UnsignedByteType,
} from "three";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

function createPMREM(renderer, scene) {
  const pmremGenerator = new PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  new RGBELoader()
    .setDataType(UnsignedByteType)
    .setPath("/textures/equirectangular/")
    .load("royal_esplanade_1k.hdr", (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;

      // scene.background = envMap;
      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();
    });
}

export function loadEnvironments(app) {
  createPMREM(app.renderer, app.scene);

  // const cubeTextureLoader = new CubeTextureLoader();

  // const path = '/textures/cube/skyboxsun25deg/';

  // const urls = [
  //   `${path}px.jpg`,
  //   `${path}nx.jpg`,
  //   `${path}py.jpg`,
  //   `${path}ny.jpg`,
  //   `${path}pz.jpg`,
  //   `${path}nz.jpg`,
  // ];

  // const sky = cubeTextureLoader.load(urls);
  // sky.mapping = CubeReflectionMapping;
  // sky.encoding = sRGBEncoding;

  // return {
  //   sky,
  // };
}
