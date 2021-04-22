function setupCamera(camera) {
  camera.position.set(-0.5, 0.4, 0.8);

  camera.near = 0.1;
  camera.far = 10;

  camera.updateProjectionMatrix();
}

export { setupCamera };
