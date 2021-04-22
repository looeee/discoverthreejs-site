import { sRGBEncoding, TextureLoader } from "three";

function loadTextures() {
  const textureLoader = new TextureLoader();

  const cover = textureLoader.load(
    "/models/front_page/book/cover_splatter_new.jpg"
  );
  cover.encoding = sRGBEncoding;
  cover.anisotropy = 16;
  cover.flipY = false;

  const reflection = textureLoader.load(
    "/models/front_page/book/reflection_512.png"
  );
  reflection.encoding = sRGBEncoding;

  return {
    cover,
    reflection,
  };
}

export { loadTextures };
