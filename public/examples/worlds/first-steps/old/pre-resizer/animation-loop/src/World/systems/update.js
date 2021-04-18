import { Clock } from 'three';

const clock = new Clock();

function update(updatables) {
  // only call the getDelta function once per frame!
  const delta = clock.getDelta();

  console.log(
    `The last frame rendered in ${delta * 1000} milliseconds`,
  );

  for (const object of updatables) {
    object.tick(delta);
  }
}

export { update };
