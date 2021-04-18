import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { convertMeshToPoints } from './utilities/convertMeshToPoints.js';
import { createSparkleMaterial } from './utilities/createSparkleMaterial.js';
import { createSizesAttribute } from './utilities/createSizesAttribute.js';
import { setupAnimation } from './utilities/setupAnimation.js';

async function createSparkleHorse() {
  const loader = new GLTFLoader();
  const data = await loader.loadAsync('/assets/models/Horse.glb');

  const model = data.scene.children[0];
  const clip = data.animations[0];

  const material = createSparkleMaterial();

  const sparkleHorse = convertMeshToPoints(model, material);

  sparkleHorse.rotation.y = Math.PI / 2;

  sparkleHorse.scale.multiplyScalar(0.03);

  const sizeAttribute = createSizesAttribute(sparkleHorse.geometry);

  sparkleHorse.geometry.setAttribute('size', sizeAttribute);

  setupAnimation(sparkleHorse, clip, sizeAttribute);

  return sparkleHorse;
}

export { createSparkleHorse };
