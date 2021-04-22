function addBloomPassFolder(folder, pass, name = 'Bloom Pass') {

  const subfolder = folder.addFolder(name);

  const params = {
    enabled: pass.enabled,
    radius: pass.radius,
    strength: pass.strength,
    threshold: pass.threshold,
  }

  subfolder.add(params, 'enabled').name('Enabled').onChange(function () {

    pass.enabled = params.enabled;

  });

  subfolder.add(params, 'radius', 0.0, 2.0, 0.01).name('Radius').onChange(function () {

    pass.radius = params.radius;

  });

  subfolder.add(params, 'strength', 0.0, 10.0, 0.01).name('Strength').onChange(function () {

    pass.strength = params.strength;

  });

  subfolder.add(params, 'threshold', 0.0, 1, 0.001).name('Threshold').onChange(function () {

    pass.threshold = params.threshold;

  });

}

function addOutlinePassFolder(folder, pass) {

  const subfolder = folder.addFolder('Outline Pass');

  const params = {
    enabled: pass.enabled,
    edgeGlow: pass.edgeGlow,
    // usePatternTexture: pass.usePatternTexture,
    edgeThickness: pass.edgeThickness,
    edgeStrength: pass.edgeStrength,
    pulsePeriod: pass.pulsePeriod,
  }

  subfolder.add(params, 'enabled').name('Rnabled').onChange(function () {

    pass.enabled = params.enabled;

  });

  subfolder.add(params, 'edgeGlow', 0.0, 10.0, 0.01).name('Edge Glow').onChange(function () {

    pass.edgeGlow = params.edgeGlow;

  });

  subfolder.add(params, 'edgeThickness', 0.0, 10.0, 0.01).name('Edge Thickness').onChange(function () {

    pass.edgeThickness = params.edgeThickness;

  });

  subfolder.add(params, 'edgeStrength', 0.0, 10.0, 0.01).name('Edge Strength').onChange(function () {

    pass.edgeStrength = params.edgeStrength;

  });

  subfolder.add(params, 'pulsePeriod', 0.0, 10.0, 0.01).name('Pulse Period').onChange(function () {

    pass.pulsePeriod = params.pulsePeriod;

  });
}

function addColorCorrectionPassFolder(folder, pass) {

  const subfolder = folder.addFolder('Color Correction');

  const params = {
    enabled: pass.enabled,
    toneMappingExposure: pass.uniforms.toneMappingExposure.value,
    brightness: pass.uniforms.brightness.value,
    contrast: pass.uniforms.contrast.value,
  }

  subfolder.add(params, 'enabled').name('Rnabled').onChange(function () {

    pass.enabled = params.enabled;

  });

  subfolder.add(params, 'toneMappingExposure', 0.0, 2.0, 0.01).name('Exposure').onChange(function () {

    pass.uniforms.toneMappingExposure.value = params.toneMappingExposure;

  });

  subfolder.add(params, 'brightness', -0.5, 0.5, 0.01).name('Brightness').onChange(function () {

    pass.uniforms.brightness.value = params.brightness;

  });

  subfolder.add(params, 'contrast', -0.5, 0.5, 0.01).name('Contrast').onChange(function () {

    pass.uniforms.contrast.value = params.contrast;

  });

}

export function setupPostDebugFolder(gui, passes) {

  const folder = gui.addFolder('Post-processing');

  addBloomPassFolder(folder, passes.bloomPass);
  addColorCorrectionPassFolder(folder, passes.correctionPass);

}