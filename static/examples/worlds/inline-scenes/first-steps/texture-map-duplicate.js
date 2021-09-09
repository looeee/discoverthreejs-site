// TODO: duplicated to allow twice in one page

import {
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let renderer;
let scene;
let mesh;

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {
  // nothing for now
}

// render, or 'draw a still image', of the scene
function render() {
  renderer.render(scene, camera);
}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize(container.clientWidth, container.clientHeight);
}

export default function init(containerID) {
  // Get a reference to the container element that will hold our scene
  container = document.querySelector(containerID);

  // create a Scene
  scene = new Scene();
  scene.background = new Color(0x8fbcd4);

  camera = new PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    50
  );

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set(-2, 2, 5);

  let controls = new OrbitControls(camera, container);
  controls.enablePan = false;
  controls.enableZoom = false;

  // create a geometry
  const geometry = new BoxBufferGeometry(2, 2, 2);

  const textureLoader = new TextureLoader();

  const texture = textureLoader.load(
    "/examples/assets/textures/uv-test-bw.png"
  );

  texture.anisotropy = 16;

  const material = new MeshBasicMaterial({
    map: texture,
  });

  // create a Mesh containing the geometry and material
  mesh = new Mesh(geometry, material);

  // add the mesh to the scene object
  scene.add(mesh);

  // create a WebGLRenderer and set its width and height
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  // add the automatically created <canvas> element to the page
  container.appendChild(renderer.domElement);

  renderer.setAnimationLoop(() => {
    update();
    render();
  });

  window.addEventListener("resize", onWindowResize);
}
