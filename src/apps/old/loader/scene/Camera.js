export default class Camera {
  constructor(app) {
    this.app = app;
  }

  fitToLoadedObjects() {
    const scene = this.app.scene;
    const camera = this.app.camera;

    scene.updateMatrixWorld();

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const length = size.length();
    const center = box.getCenter(new THREE.Vector3());

    this.app.controls.reset();

    // scene.position.x += ( scene.position.x - center.x );
    // scene.position.y += ( scene.position.y - center.y );
    // scene.position.z += ( scene.position.z - center.z );

    this.app.controls.maxDistance = length * 10;

    camera.near = parseFloat((length / 100).toFixed(2));
    camera.far = parseFloat((length * 50).toFixed(0));

    camera.position.copy(center);
    camera.position.x += length / 2.0;
    camera.position.y += length / 5.0;
    camera.position.z += length * 1.25;

    camera.updateProjectionMatrix();

    this.app.controls.target.copy(center);

    this.app.controls.update();
  }
}
