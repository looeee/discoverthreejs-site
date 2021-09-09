import {
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereBufferGeometry,
} from "https://cdn.skypack.dev/three@0.132.2";

class Snake {
  constructor() {
    this.group = new Group();

    this.createGeometries();
    this.createMaterials();
    this.createMeshes();

    return this.group;
  }

  createGeometries() {
    const sphere = new SphereBufferGeometry(0.25, 8, 8);

    this.geometries = {
      sphere,
    };
  }

  createMaterials() {
    const main = new MeshStandardMaterial({
      color: "indigo",
    });

    this.materials = {
      main,
    };
  }

  createMeshes() {
    const protoSphere = new Mesh(this.geometries.sphere, this.materials.main);

    this.group.add(protoSphere);

    for (let i = 0; i < 1; i += 0.001) {
      const sphere = protoSphere.clone();

      sphere.position.x = Math.sin(2 * Math.PI * i);
      sphere.position.y = Math.cos(2 * Math.PI * i);
      sphere.position.z = -i * 5;

      sphere.scale.multiplyScalar(0.01 + i);

      this.group.add(sphere);
    }
  }
}

export { Snake };
