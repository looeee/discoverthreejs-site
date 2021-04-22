function setupControls(controls) {
  controls.target.set(0, 0.06, 0);

  controls.enableDamping = true;
  controls.dampingFactor = 0.2;

  // controls.minDistance = 0;
  // controls.maxDistance = 100;

  controls.enableZoom = false;
  controls.enablePan = false;

  controls.maxPolarAngle = Math.PI / 2.2;

  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.1;
  controls.rotateSpeed = 0.2;

  controls.update();
  controls.saveState();
}

export { setupControls };
