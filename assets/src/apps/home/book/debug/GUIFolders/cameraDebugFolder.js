function setupCameraSubfolder(folder, camera) {

  const subfolder = folder.addFolder('Camera');

  const params = {
    near: camera.near,
    far: camera.far,
    zoom: camera.zoom,
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  }

  subfolder.add(params, 'near', 0.01, 1.0, 0.01).name('Near Clipping Plane').onChange(function () {

    camera.near = params.near;

    camera.updateProjectionMatrix();

  });

  subfolder.add(params, 'far', 1, 10.0, 0.1).name('Far Clipping Plane').onChange(function () {

    camera.far = params.far;

    camera.updateProjectionMatrix();

  });

  subfolder.add(params, 'zoom', 0, 10.0, 0.1).name('Zoom').onChange(function () {

    camera.zoom = params.zoom;

    camera.updateProjectionMatrix();

  });

  subfolder.add(params, 'x', -1, 1, 0.01).name('X position').onChange(function () {

    camera.position.x = params.x;

  });

  subfolder.add(params, 'y', -1, 1, 0.01).name('Y position').onChange(function () {

    camera.position.y = params.y;

  });

  subfolder.add(params, 'z', -1, 1, 0.01).name('Z position').onChange(function () {

    camera.position.z = params.z;

  });

}

function setupControlsSubfolder(folder, controls) {

  const subfolder = folder.addFolder('Controls');

  const params = {
    autoRotate: controls.autoRotate,
    autoRotateSpeed: controls.autoRotateSpeed,
    dampingFactor: controls.dampingFactor,
    enableDamping: controls.enableDamping,
    enableKeys: controls.enableKeys,
    enablePan: controls.enablePan,
    enableRotate: controls.enableRotate,
    enableZoom: controls.enableZoom,
    keyPanSpeed: controls.keyPanSpeed,
    minAzimuthAngle: controls.minAzimuthAngle,
    maxAzimuthAngle: controls.maxAzimuthAngle,
    minDistance: controls.minDistance,
    maxDistance: controls.maxDistance,
    minPolarAngle: controls.minPolarAngle,
    maxPolarAngle: controls.maxPolarAngle,
    panSpeed: controls.panSpeed,
    rotateSpeed: controls.rotateSpeed,
    targetX: controls.target.x,
    targetY: controls.target.y,
    targetZ: controls.target.z,
    minZoom: controls.minZoom,
    maxZoom: controls.maxZoom,
    zoomSpeed: controls.zoomSpeed,
  }

  subfolder.add(params, 'targetX', -0.1, 0.1, 0.001).name('Target X Position').onChange(function () {

    controls.target.x = params.targetX;
    controls.update();

  });

  subfolder.add(params, 'targetY', -0.1, 0.1, 0.001).name('Target Y Position').onChange(function () {

    controls.target.y = params.targetY;
    controls.update();

  });

  subfolder.add(params, 'targetZ', -0.1, 0.1, 0.001).name('Target Z Position').onChange(function () {

    controls.target.z = params.targetZ;
    controls.update();

  });

  subfolder.add(params, 'autoRotate').name('Auto Rotate').onChange(function () {

    controls.autoRotate = params.autoRotate;

  });

  subfolder.add(params, 'autoRotateSpeed', -10, 10, 0.01).name('Auto Rotate Speed').onChange(function () {

    controls.autoRotateSpeed = params.autoRotateSpeed;

  });

  subfolder.add(params, 'enableDamping').name('Enable Damping').onChange(function () {

    controls.enableDamping = params.enableDamping;

  });

  subfolder.add(params, 'dampingFactor', 0.01, 1, 0.01).name('Damping Factor').onChange(function () {

    controls.dampingFactor = params.dampingFactor;

  });

  subfolder.add(params, 'enablePan').name('Enable Pan').onChange(function () {

    controls.enablePan = params.enablePan;

  });

  subfolder.add(params, 'enableKeys').name('Keyboard Pan').onChange(function () {

    controls.enableKeys = params.enableKeys;

  });

  subfolder.add(params, 'panSpeed', 0, 5, 0.01).name('Mouse/Touch Pan Speed').onChange(function () {

    controls.panSpeed = params.panSpeed;

  });


  subfolder.add(params, 'keyPanSpeed', 0, 20, 0.01).name('Keys Pan Speed').onChange(function () {

    controls.keyPanSpeed = params.keyPanSpeed;

  });

  subfolder.add(params, 'enableRotate').name('Enable Rotate').onChange(function () {

    controls.enableRotate = params.enableRotate;

  });

  subfolder.add(params, 'rotateSpeed', 0, 10, 0.01).name('Rotate Speed').onChange(function () {

    controls.rotateSpeed = params.rotateSpeed;

  });

  subfolder.add(params, 'minAzimuthAngle', - Math.PI, Math.PI, 0.01).name('Min Azimuth Angle').onChange(function () {

    controls.minAzimuthAngle = params.minAzimuthAngle;

  });

  subfolder.add(params, 'maxAzimuthAngle', - Math.PI, Math.PI, 0.01).name('Max Azimuth Angle').onChange(function () {

    controls.maxAzimuthAngle = params.maxAzimuthAngle;

  });

  subfolder.add(params, 'minPolarAngle', 0, Math.PI, 0.01).name('Min Polar Angle').onChange(function () {

    controls.minPolarAngle = params.minPolarAngle;

  });

  subfolder.add(params, 'maxPolarAngle', 0, Math.PI, 0.01).name('Max Polar Angle').onChange(function () {

    controls.maxPolarAngle = params.maxPolarAngle;

  });

  subfolder.add(params, 'enableZoom').name('Enable Zoom').onChange(function () {

    controls.enableZoom = params.enableZoom;

  });

  subfolder.add(params, 'minDistance', 0, 10, 0.01).name('Min Zoom').onChange(function () {

    controls.minDistance = params.minDistance;

  });

  subfolder.add(params, 'maxDistance', 1, 10, 0.01).name('Max Zoom').onChange(function () {

    controls.maxDistance = params.maxDistance;

  });

  subfolder.add(params, 'zoomSpeed', 0, 5, 0.01).name('Zoom Speed').onChange(function () {

    controls.zoomSpeed = params.zoomSpeed;

  });

}

export function setupCameraDebugFolder(gui, camera, controls) {

  const folder = gui.addFolder('Camera and Controls');

  setupCameraSubfolder(folder, camera);

  setupControlsSubfolder(folder, controls);

}