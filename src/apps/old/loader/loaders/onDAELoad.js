const onDAELoad = (dae, app) => {
  const model = dae.scene;

  if (dae.animations && dae.animations[0]) {
    const animation = dae.animations[0];
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

export default onDAELoad;
