function addMaterialCommonParams(subfolder, material) {
  const params = {
    alphaTest: material.alphaTest,
    // blendDst: material.blendDst,
    // blendDstAlpha: material.blendDstAlpha,
    // blendEquation: material.blendEquation,
    // blendEquationAlpha: material.blendEquationAlpha,
    // blending: material.blending,
    // blendSrc: material.blendSrc,
    // blendSrcAlpha: material.blendSrcAlpha,
    // clipIntersection: material.clipIntersection,
    // clippingPlanes: material.clippingPlanes,
    // clipShadows: material.clipShadows,
    // colorWrite: material.colorWrite,
    // depthFunc: material.depthFunc,
    // depthTest: material.depthTest,
    // depthWrite: material.depthWrite,
    // stencilWrite: material.stencilWrite,
    // stencilFunc: material.stencilFunc,
    // stencilRef: material.stencilRef,
    // stencilMask: material.stencilMask,
    // stencilFail: material.stencilFail,
    // stencilZFail: material.stencilZFail,
    // stencilZPass: material.stencilZPass,
    flatShading: material.flatShading,
    // fog: material.fog,
    opacity: material.opacity,
    // polygonOffset: material.polygonOffset,
    // polygonOffsetFactor: material.polygonOffsetFactor,
    // polygonOffsetUnits: material.polygonOffsetUnits,
    // precision: material.precision,
    premultipliedAlpha: material.premultipliedAlpha,
    // shadowSide: material.shadowSide,
    // side: material.side,
    transparent: material.transparent,
    // vertexColors: material.vertexColors,
    // vertexTangents: material.vertexTangents,
    visible: material.visible,
  };

  subfolder
    .add(params, 'alphaTest', 0, 1, 0.01)
    .name('Alpha Cutout')
    .onChange(function () {
      material.alphaTest = params.alphaTest;
    });

  subfolder
    .add(params, 'flatShading')
    .name('Flat Shading')
    .onChange(function () {
      material.flatShading = params.flatShading;
    });

  subfolder
    .add(params, 'premultipliedAlpha')
    .name('Premultiplied_Alpha')
    .onChange(function () {
      material.premultipliedAlpha = params.premultipliedAlpha;
    });

  subfolder
    .add(params, 'transparent')
    .name('Transparent')
    .onChange(function () {
      material.transparent = params.transparent;
    });

  subfolder
    .add(params, 'opacity', 0, 1, 0.01)
    .name('Opacity')
    .onChange(function () {
      material.opacity = params.opacity;
    });

  subfolder
    .add(params, 'visible')
    .name('Visible')
    .onChange(function () {
      material.visible = params.visible;
    });
}

function addMeshMaterialCommonParams(subfolder, material) {
  const params = {
    // alphaMap: material.alphaMap,
    // aoMap: material.aoMap,
    // aoMapIntensity: material.aoMapIntensity,
    color: material.color.getHex(),
    // envMap: material.envMap,
    // lightMap: material.lightMap,
    // lightMapIntensity: material.lightMapIntensity,
    // map: material.map,
    // morphTargets: material.morphTargets,
    skinning: material.skinning,
    wireframe: material.wireframe,
    refractionRatio: material.refractionRatio,
  };

  subfolder
    .addColor(params, 'color')
    .name('Color')
    .onChange(function () {
      material.color.set(params.color);
      material.color.convertSRGBToLinear();
    });

  subfolder
    .add(params, 'skinning')
    .name('Skinning')
    .onChange(function () {
      material.skinning = params.skinning;
    });

  subfolder
    .add(params, 'wireframe')
    .name('Wireframe')
    .onChange(function () {
      material.wireframe = params.wireframe;
    });

  subfolder
    .add(params, 'refractionRatio', 0.01, 3, 0.01)
    .name('Refraction Ratio')
    .onChange(function () {
      material.refractionRatio = params.refractionRatio;
    });
}

function addMeshBasicMaterialSubfolder(folder, material) {
  const subfolder = folder.addFolder(material.name);

  addMaterialCommonParams(subfolder, material);
  addMeshMaterialCommonParams(subfolder, material);

  const params = {
    // combine: material.combine,
    reflectivity: material.reflectivity,
    // specularMap: material.specularMap,
  };

  subfolder
    .add(params, 'reflectivity', 0, 1, 0.01)
    .name('Reflectivity')
    .onChange(function () {
      material.reflectivity = params.reflectivity;
    });
}

function addMeshStandardMaterialSubfolder(folder, material) {
  const subfolder = folder.addFolder(material.name);

  addMaterialCommonParams(subfolder, material);
  addMeshMaterialCommonParams(subfolder, material);

  const params = {
    envMapIntensity: material.envMapIntensity,
    // bumpMap: material.bumpMap,
    // bumpScale: material.bumpScale,
    // displacementMap: material.displacementMap,
    // displacementScale: material.displacementScale,
    // displacementBias: material.displacementBias,
    emissive: material.emissive.getHex(),
    // emissiveMap: material.emissiveMap,
    // emissiveIntensity: material.emissiveIntensity,
    metalness: material.metalness,
    // metalnessMap: material.metalnessMap,
    // morphNormals: material.morphNormals,
    // normalMap: material.normalMap,
    // normalMapType: material.normalMapType,
    // normalScale: material.normalScale,
    roughness: material.roughness,
    // roughnessMap: material.roughnessMap,
  };

  subfolder
    .addColor(params, 'emissive')
    .name('Emissive Color')
    .onChange(function () {
      material.emissive.set(params.emissive);
      material.emissive.convertSRGBToLinear();
    });

  subfolder
    .add(params, 'envMapIntensity', 0, 100, 0.01)
    .name('envMapIntensity')
    .onChange(function () {
      material.envMapIntensity = params.envMapIntensity;
    });

  subfolder
    .add(params, 'metalness', 0, 1, 0.1)
    .name('Metalness')
    .onChange(function () {
      material.metalness = params.metalness;
    });

  subfolder
    .add(params, 'roughness', 0, 1, 0.01)
    .name('Roughness')
    .onChange(function () {
      material.roughness = params.roughness;
    });
}

export function setupMaterialsDebugFolder(gui, materials) {
  console.log(':: materials', materials);
  const folder = gui.addFolder('Materials');

  Object.values(materials).forEach(material => {
    if (material.type === 'MeshBasicMaterial') {
      addMeshBasicMaterialSubfolder(folder, material);
    }

    if (
      material.type === 'MeshStandardMaterial' ||
      material.type === 'MeshPhysicalMaterial'
    ) {
      addMeshStandardMaterialSubfolder(folder, material);
    }
  });

  folder.open();
}
