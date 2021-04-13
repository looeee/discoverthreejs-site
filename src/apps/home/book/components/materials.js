import {
  MeshBasicMaterial,
  MeshStandardMaterial,
  ShadowMaterial,
} from 'three';

function createMaterials(textures) {
  const cover = new MeshStandardMaterial({
    map: textures.cover,
    envMapIntensity: 11,
    roughness: 0.5,
    metalness: 0,
  });
  cover.name = 'cover';

  const pages = new MeshStandardMaterial({
    map: textures.cover,
    color: 0xbbbbbb,
    roughness: 1,
    metalness: 0,
  });

  pages.name = 'pages';

  return {
    book: {
      cover,
      pages,
    },

    ground: {
      reflection: new MeshBasicMaterial({
        map: textures.reflection,
        transparent: true,
        opacity: 0.5,
      }),
    },

    shadow: new ShadowMaterial({ opacity: 0.2 }),
  };
}

export { createMaterials };
