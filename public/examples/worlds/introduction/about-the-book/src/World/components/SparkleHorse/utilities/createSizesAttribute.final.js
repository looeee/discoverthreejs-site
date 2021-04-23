import { Float32BufferAttribute } from 'three';

function createSizesAttribute(geometry) {
  const positions = geometry.attributes.position;
  const count = positions.count;
  const sizes = [];
  for (let i = 0; i < count; i++) {
    sizes.push(1);
  }
  const sizeAttribute = new Float32BufferAttribute(sizes, 1);
  return sizeAttribute;
}

export { createSizesAttribute };
