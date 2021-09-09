import {
  AmbientLight,
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let meshA;
let meshB;

function createScene() {
  scene = new Scene();
  scene.background = new Color(0xc7deea);
}

function createCamera() {
  camera = new PerspectiveCamera(
    35, // FOV
    container.clientWidth / container.clientHeight, // aspect
    0.1, // near clipping plane
    100 // far clipping plane
  );

  camera.position.set(0, 0, 7);
}

function createControls() {
  controls = new OrbitControls(camera, container);
  controls.enableZoom = false;
  controls.enablePan = false;
}

function createLights() {
  // Create an ambient light
  const light = new AmbientLight(0xffffff, 2 * Math.PI);

  // remember to add the light to the scene
  scene.add(light);
}

function createMeshes() {
  // create a geometry
  const geometry = new BoxBufferGeometry(1.5, 1.5, 1.5);

  // create a purple Standard material
  const materialA = new MeshStandardMaterial({ color: "purple" });

  const materialB = new MeshBasicMaterial({ color: "purple" });

  // create a Mesh containing the geometry and material
  meshA = new Mesh(geometry, materialA);
  meshA.position.set(-1.5, 0, 0);

  meshB = new Mesh(geometry, materialB);
  meshB.position.set(1.5, 0, 0);

  // add the mesh to the scene object
  scene.add(meshA, meshB);
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
  // increase the mesh's rotation each frame
  meshA.rotation.z += 0.01;
  meshA.rotation.x += 0.01;
  meshA.rotation.y += 0.01;

  // increase the mesh's rotation each frame
  meshB.rotation.z += 0.01;
  meshB.rotation.x += 0.01;
  meshB.rotation.y += 0.01;
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
