import { World } from './World.js';

async function main() {
  // create a new world
  const world = new World('#scene-container');

  // draw the scene
  world.start();

  await world.loadModels();
}

main();
