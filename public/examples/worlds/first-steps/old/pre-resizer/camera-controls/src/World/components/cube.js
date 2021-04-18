import {
  BoxBufferGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
} from 'three';

function createMaterial() {
  const textureLoader = new TextureLoader();

  const texture = textureLoader.load(
    '/assets/textures/uv-test-bw.png',
  );

  const material = new MeshStandardMaterial({
    map: texture,
  });

  return material;
}

function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);

  const material = createMaterial();

  const cube = new Mesh(geometry, material);

  const radiansPerSecond = MathUtils.degToRad(30);

  cube.tick = (delta) => {
    cube.rotation.z += delta * radiansPerSecond;
    cube.rotation.x += delta * radiansPerSecond;
    cube.rotation.y += delta * radiansPerSecond;
  };

  return cube;
}

export { createCube };
