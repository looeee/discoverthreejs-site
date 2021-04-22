function addDirectionalLightFolder(folder, light) {
  const subfolder = folder.addFolder('Main Light');

  const params = {
    visible: light.visible,
    'position.x': light.position.x,
    'position.y': light.position.y,
    'position.z': light.position.z,
    color: light.color.getHex(),
    intensity: light.intensity,
  };

  subfolder
    .add(params, 'visible')
    .name('Visible')
    .onChange(function () {
      light.visible = params.visible;
    });

  subfolder
    .add(params, 'position.x', -0.5, 0.5, 0.001)
    .name('position.x')
    .onChange(function () {
      light.position.x = params['position.x'];
    });

  subfolder
    .add(params, 'position.y', -0.5, 0.5, 0.001)
    .name('position.y')
    .onChange(function () {
      light.position.y = params['position.y'];
    });

  subfolder
    .add(params, 'position.z', -0.5, 0.5, 0.001)
    .name('position.z')
    .onChange(function () {
      light.position.z = params['position.z'];
    });

  subfolder
    .addColor(params, 'color')
    .name('Color')
    .onChange(function () {
      light.color.set(params.color);
      light.color.convertSRGBToLinear();
    });

  subfolder
    .add(params, 'intensity', 0.0, 100.0, 0.01)
    .name('Intensity')
    .onChange(function () {
      light.intensity = params.intensity;
    });
}

function addHemisphereLightFolder(folder, light) {
  const subfolder = folder.addFolder('Ambient Light');

  const params = {
    visible: light.visible,
    color: light.color.getHex(),
    groundColor: light.groundColor.getHex(),
    intensity: light.intensity,
  };

  subfolder
    .add(params, 'visible')
    .name('Visible')
    .onChange(function () {
      light.visible = params.visible;
    });

  subfolder
    .addColor(params, 'color')
    .name('Sky Color')
    .onChange(function () {
      light.color.set(params.color);
      light.color.convertSRGBToLinear();
    });

  subfolder
    .addColor(params, 'groundColor')
    .name('Ground Color')
    .onChange(function () {
      light.groundColor.set(params.groundColor);
      light.groundColor.convertSRGBToLinear();
    });

  subfolder
    .add(params, 'intensity', 0.0, 10.0, 0.01)
    .name('Intensity')
    .onChange(function () {
      light.intensity = params.intensity;
    });
}

export function setupPostDebugFolder(gui, lights) {
  const folder = gui.addFolder('Lights');

  Object.values(lights).forEach(light => {
    if (light.isDirectionalLight)
      addDirectionalLightFolder(folder, light);
    else if (light.isHemisphereLight)
      addHemisphereLightFolder(folder, light);
  });
}
