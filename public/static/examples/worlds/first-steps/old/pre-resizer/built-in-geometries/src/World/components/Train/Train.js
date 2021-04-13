import { Group } from 'three';

import { createGeometries } from './geometries.js';
import { createMaterials } from './materials.js';
import { createMeshes } from './meshes.js';

class Train extends Group {
  constructor() {
    super();

    const geometries = createGeometries();
    const materials = createMaterials();
    const meshes = createMeshes(geometries, materials);

    this.add(...meshes);
  }
}

export { Train };
