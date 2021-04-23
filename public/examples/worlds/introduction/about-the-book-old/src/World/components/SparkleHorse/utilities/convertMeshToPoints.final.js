import { Points } from 'three';

function convertMeshToPoints(mesh, material) {
  const points = new Points(mesh.geometry, material);

  return points;
}

export { convertMeshToPoints };
