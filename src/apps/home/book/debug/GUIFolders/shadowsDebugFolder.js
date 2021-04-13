function addDirectionalShadowFolder(folder, light) {
  const subfolder = folder.addFolder('Directional Light sShadow');

  const shadowCamera = light.shadow.camera;

  const params = {
    castShadow: light.castShadow,
    near: shadowCamera.near,
    far: shadowCamera.far,
    top: shadowCamera.top,
    bottom: shadowCamera.bottom,
    left: shadowCamera.left,
    right: shadowCamera.right,
    radius: light.shadow.radius,
    bias: light.shadow.bias,
  };

  subfolder
    .add(params, 'castShadow')
    .name('Cast Shadow')
    .onChange(() => {
      light.castShadow = params.castShadow;
    });

  subfolder
    .add(params, 'near', 0, 1, 0.001)
    .name('Near')
    .onChange(() => {
      shadowCamera.near = params.near;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(params, 'far', 0.1, 3, 0.001)
    .name('far')
    .onChange(() => {
      shadowCamera.far = params.far;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(params, 'top', 0, 3, 0.001)
    .name('top')
    .onChange(() => {
      shadowCamera.top = params.top;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(params, 'bottom', -3, 0, 0.001)
    .name('bottom')
    .onChange(() => {
      shadowCamera.bottom = params.bottom;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(params, 'left', -3, 0, 0.001)
    .name('left')
    .onChange(() => {
      shadowCamera.left = params.left;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(params, 'right', 0, 3, 0.001)
    .name('right')
    .onChange(() => {
      shadowCamera.right = params.right;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(params, 'radius', 0, 5, 0.01)
    .name('radius')
    .onChange(() => {
      light.shadow.radius = params.radius;
    });

  subfolder
    .add(params, 'bias', -0.1, 0.1, 0.0001)
    .name('bias')
    .onChange(() => {
      light.shadow.bias = params.bias;
    });
}

export function setupPostDebugFolder(gui, lights) {
  const folder = gui.addFolder('Shadows');
  folder.open();

  for (const light of Object.values(lights)) {
    if (light.isDirectionalLight)
      addDirectionalShadowFolder(folder, light);
  }
}
