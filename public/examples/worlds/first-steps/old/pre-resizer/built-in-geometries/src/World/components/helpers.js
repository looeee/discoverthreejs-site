import { AxesHelper, GridHelper } from 'three';

function createHelpers() {
  const axes = new AxesHelper(5);
  axes.position.set(5.5, 0, 0);

  const grid = new GridHelper();

  return {
    axes,
    grid,
  };
}

export { createHelpers };
