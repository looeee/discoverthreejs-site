import { World } from './World/World.js';

function main() {
  // create a new world
  const world = new World();

  const container = document.querySelector('#scene-container');
  container.append(world.canvas);

  world.setSize(
    container.clientWidth,
    container.clientHeight,
    window.devicePixelRatio,
  );

  window.addEventListener('resize', () => {
    world.setSize(
      container.clientWidth,
      container.clientHeight,
      window.devicePixelRatio,
    );
  });

  world.start();
}

main();
