const onGLTFLoad = (gltf, app) => {
  const model = gltf.scene;

  if (gltf.animations && gltf.animations[0]) {
    const animation = gltf.animations[0];
    const mixer = new THREE.AnimationMixer(model);

    model.userData.onUpdate = (delta) => {
      mixer.update(delta);
    };

    const action = mixer.clipAction(animation);
    action.play();
  }

  app.scene.add(model);

  return model;
};

export default onGLTFLoad;
