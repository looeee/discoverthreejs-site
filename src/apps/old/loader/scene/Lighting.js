export default class Lighting {
  constructor(app) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    app.scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(10, 10, 10);

    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(-10, 10, -10);

    app.scene.add(frontLight, backLight);
  }
}
