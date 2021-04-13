import { AnimationMixer } from 'three';

function setupAnimation(model, clip, sizeAttribute) {
  const mixer = new AnimationMixer(model);
  const action = mixer.clipAction(clip);
  action.play();

  const minPointSize = 0.75;
  let time = 0;

  model.tick = (delta) => {
    mixer.update(delta);
    time += delta * 10;

    for (let i = 0; i < sizeAttribute.count; i++) {
      sizeAttribute.array[i] =
        minPointSize + 0.5 * Math.sin(i + time);
    }

    sizeAttribute.needsUpdate = true;
  };
}

export { setupAnimation };
