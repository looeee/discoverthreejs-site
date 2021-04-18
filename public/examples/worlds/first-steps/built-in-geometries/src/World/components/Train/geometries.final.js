import { BoxBufferGeometry, CylinderBufferGeometry } from 'three';

function createGeometries() {
  const cabin = new BoxBufferGeometry(2, 2.25, 1.5);

  const nose = new CylinderBufferGeometry(0.75, 0.75, 3, 12);

  // we can reuse a single cylinder geometry for all 4 wheels
  const wheel = new CylinderBufferGeometry(0.4, 0.4, 1.75, 16);

  // different values for the top and bottom radius creates a cone shape
  const chimney = new CylinderBufferGeometry(0.3, 0.1, 0.5);

  return {
    cabin,
    nose,
    wheel,
    chimney,
  };
}

export { createGeometries };
