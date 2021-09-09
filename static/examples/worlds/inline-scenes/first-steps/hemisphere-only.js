import {
  BoxBufferGeometry,
  Color,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let mesh;

function createScene() {
  scene = new Scene();
  scene.background = new Color(0x8fbcd4);
}

function createCamera() {
  camera = new PerspectiveCamera(
    35, // FOV
    container.clientWidth / container.clientHeight, // aspect
    0.1, // near clipping plane
    100 // far clipping plane
  );

  camera.position.set(-3.5, 2.5, -5);
}

function createControls() {
  controls = new OrbitControls(camera, container);
  controls.enableZoom = false;
  controls.enablePan = false;
}

function createLights() {
  const ambientLight = new HemisphereLight(
    "white", // bright sky color
    "darkslategrey", // dim ground color
    10 // intensity
  );

  scene.add(ambientLight);
}

function createMeshes() {
  const geometry = new BoxBufferGeometry(2, 2, 2);

  const textureLoader = new TextureLoader();

  const texture = textureLoader.load(
    "/examples/assets/textures/uv-test-bw.png"
  );
  texture.anisotropy = 16;

  const material = new MeshStandardMaterial({
    map: texture,
  });

  mesh = new Mesh(geometry, material);

  scene.add(mesh);
}

function createRenderer() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.physicallyCorrectLights = true;
  renderer.setSize(container.clientWidth, container.clientHeight);

  // add the automatically created <canvas> element to the page
  container.appendChild(renderer.domElement);
}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {
  controls.update();
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

  createScene();
  createCamera();
  createControls();
  createLights();
  createMeshes();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });

  window.addEventListener("resize", onWindowResize);
}
