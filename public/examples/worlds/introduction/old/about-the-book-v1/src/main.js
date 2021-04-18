import { World } from './World/World.js';

async function main() {
  // create a world
  const world = new World();

  // complete async tasks
  await world.init();

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

  // start animation loop
  world.start();
}

main().catch((error) => {
  console.error(error);
});
