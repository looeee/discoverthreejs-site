import { World } from './World.js';

function main() {
  // Get a reference to the container element
  const container = document.querySelector('#scene-container');

  // create a new three.js scene
  const world = new World(container);

  // draw the scene
  world.start();
}

export { main };
