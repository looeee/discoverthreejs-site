import { World } from './World/World.js';

function main() {
  // create a new world
  const world = new World();

  // Get a reference to the container element
  const container = document.querySelector('#scene-container');

  // add the canvas to the container
  container.append(world.canvas);

  // set the world size
  world.setSize(
    container.clientWidth,
    container.clientHeight,
    window.devicePixelRatio,
  );

  // draw the scene
  world.render();
}

main();
