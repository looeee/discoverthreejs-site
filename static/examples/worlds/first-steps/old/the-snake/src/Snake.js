import { Group, Mesh, MeshStandardMaterial, SphereBufferGeometry } from "three";

class Snake {
  constructor() {
    this.group = new Group();

    this.createGeometries();
    this.createMaterials();
    this.createMeshes();

    return this.group;
  }

  createGeometries() {
    const sphere = new SphereBufferGeometry(0.25, 32, 32);

    this.geometries = {
      sphere,
    };
  }

  createMaterials() {
    const main = new MeshStandardMaterial({
      color: 0x116611, // red
      flatShading: true,
      roughness: 0.9,
    });
    const eyes = new MeshStandardMaterial({
      color: "darkslategrey",
      flatShading: true,
    });

    this.materials = {
      main,
      eyes,
    };
  }

  createMeshes() {
    const protoSphere = new Mesh(this.geometries.sphere, this.materials.main);

    //     this.group.add(protoSphere);
    const stepR = (2 * Math.PI) / 100;
    const stepS = Math.PI / 100;

    for (let i = 0; i < 1; i += 0.01) {
      const sphere = protoSphere.clone();
      sphere.scale.multiplyScalar(0.01 + i * 2);

      const s = 2 * Math.PI * i;
      const t = Math.PI * i;
      sphere.position.x = 2 * Math.cos(s) * Math.sin(t);
      sphere.position.z = 2 * Math.sin(s) * Math.sin(t);
      sphere.position.y = -2 * Math.cos(t);
      this.group.add(sphere);
    }

    const leftEye = protoSphere.clone();
    leftEye.position.set(-0.2, 2.1, 0);

    leftEye.material = this.materials.eyes;
    const rightEye = leftEye.clone();
    rightEye.position.set(-0.1, 2.1, 0.3);
    this.group.add(leftEye, rightEye);
  }
}

export { Snake };
