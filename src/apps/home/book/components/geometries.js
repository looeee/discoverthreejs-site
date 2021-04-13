import { PlaneBufferGeometry } from 'three';

function createGeometries() {
  const ground = new PlaneBufferGeometry(0.377, 0.3, 32, 32);
  ground.rotateZ(-Math.PI / 2);
  ground.rotateX(-Math.PI / 2);

  return {
    ground,
  };
}

export { createGeometries };
