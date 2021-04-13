export default class Scene {
  constructor(app) {
    app.scene.background = new THREE.Color(0x8fbcd4);

    this.scene = app.scene;
  }

  updateMaterials() {
    this.scene.traverse((child) => {
      if (child.material) {
        if (!Array.isArray(child.material)) {
          child.material.needsUpdate = true;
        } else {
          child.material.forEach((mat) => {
            mat.needsUpdate = true;
          });
        }
      }
    });
  }
}
