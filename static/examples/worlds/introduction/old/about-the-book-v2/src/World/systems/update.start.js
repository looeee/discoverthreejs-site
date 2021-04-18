import { Clock } from 'three';

const clock = new Clock();

function update(updatables) {
  const delta = clock.getDelta();

  for (const object of updatables) {
    object.tick(delta);
  }
}

export { update };
