import { AnimationMixer } from 'three';

function setupAnimationClips(model) {
  const mixer = new AnimationMixer(model);

  model.userData.onUpdate = (delta) => {
    mixer.update(delta);
  };

  model.animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.play();
  });
}

export function setupAnimation(models) {
  Object.values(models.birds).forEach((model) => {
    setupAnimationClips(model);
  });
}
