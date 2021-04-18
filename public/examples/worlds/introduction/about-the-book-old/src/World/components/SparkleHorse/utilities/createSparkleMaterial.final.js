import {
  AdditiveBlending,
  PointsMaterial,
  TextureLoader,
} from 'three';

function createSparkleMaterial() {
  const map = new TextureLoader().load(
    '/assets/textures/sprites/spark1.png',
  );

  const material = new PointsMaterial({
    map,
    // size: 0.75,
    color: 'white',
    morphTargets: true,
    blending: AdditiveBlending,
    depthTest: false,
    // transparent: true,
    vertexColors: true,
  });

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      'uniform float size;',
      'attribute float size;',
    );
  };

  return material;
}

export { createSparkleMaterial };
