const onFBXLoad = (fbx, app) => {
  if (fbx.animations && fbx.animations[0]) {
    const animation = fbx.animations[0];
    const mixer = new THREE.AnimationMixer(fbx);

    fbx.userData.onUpdate = (delta) => {
      mixer.update(delta);
    };

    const action = mixer.clipAction(animation);
    action.play();
  }

  app.scene.add(fbx);

  return fbx;
};

export default onFBXLoad;
