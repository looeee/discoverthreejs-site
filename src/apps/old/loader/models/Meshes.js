export default class Meshes {
  constructor() {
    this.meshes = {};
  }

  add(mesh) {
    this.meshes[mesh.uuid] = mesh;
  }
}
