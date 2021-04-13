import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function setupBook(book, materials) {
  const cover = book.getObjectByName('cover');
  const pages = book.getObjectByName('pages');

  cover.material = materials.book.cover;
  pages.material = materials.book.pages;

  cover.castShadow = true;
  // cover.receiveShadow = true;

  pages.castShadow = true;
  // pages.receiveShadow = true;

  const coverShadow = cover.clone();
  coverShadow.receiveShadow = true;
  coverShadow.material = materials.shadow;

  return {
    cover,
    pages,

    coverShadow,
  };
}

async function loadGLTFModels(materials) {
  const loader = new GLTFLoader();

  // first, start all the async operation
  const bookPromise = loader.loadAsync(
    '/static/models/front_page/book/book.glb',
  );
  const parrotPromise = loader.loadAsync(
    '/static/models/front_page/Parrot.glb',
  );
  const flamingoPromise = loader.loadAsync(
    '/static/models/front_page/Flamingo.glb',
  );
  const storkPromise = loader.loadAsync(
    '/static/models/front_page/Stork.glb',
  );

  // next, wait for them to complete
  const bookResult = await bookPromise;
  const parrotResult = await parrotPromise;
  const flamingoResult = await flamingoPromise;
  const storkResult = await storkPromise;

  const book = setupBook(bookResult.scene, materials);

  const parrot = parrotResult.scene.children[0];
  parrot.animations = parrotResult.animations;
  parrot.scale.multiplyScalar(0.001);
  parrot.position.set(-0.125, 0.3, 0);
  parrot.castShadow = true;

  const flamingo = flamingoResult.scene.children[0];
  flamingo.animations = flamingoResult.animations;
  flamingo.scale.multiplyScalar(0.001);
  flamingo.position.set(0.075, 0.2, 0.2);
  flamingo.castShadow = true;

  const stork = storkResult.scene.children[0];
  stork.animations = storkResult.animations;
  stork.scale.multiplyScalar(0.001);
  stork.position.set(-0.1, 0.2, -0.2);
  stork.castShadow = true;

  return {
    birds: {
      parrot,
      flamingo,
      stork,
    },
    book,
  };
}

export { loadGLTFModels };
