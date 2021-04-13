import { Mesh } from 'three';

function createGroundReflection(geometries, materials) {
  const reflection = new Mesh(
    geometries.ground,
    materials.ground.reflection,
  );

  reflection.position.set(-0.163, 0, 0.074);
  reflection.renderOrder = 10;

  return reflection;
}

function createGroundShadow(geometries, materials) {
  const shadow = new Mesh(geometries.ground, materials.shadow);

  shadow.position.y += 0.001;
  shadow.receiveShadow = true;

  shadow.renderOrder = 9;

  shadow.scale.multiplyScalar(3);

  return shadow;
}

function createMeshes(geometries, materials) {
  return {
    ground: {
      reflection: createGroundReflection(geometries, materials),
      shadow: createGroundShadow(geometries, materials),
    },
  };
}

export { createMeshes };
