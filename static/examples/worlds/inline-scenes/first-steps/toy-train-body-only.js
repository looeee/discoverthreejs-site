import {
  BoxBufferGeometry,
  Color,
  CylinderBufferGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
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

function createCamera() {
  camera = new PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(-5, 3, 6);
}

function createControls() {
  controls = new OrbitControls(camera, container);
  controls.enablePan = false;
  controls.enableZoom = false;
}

function createLights() {
  const ambientLight = new HemisphereLight(
    "white", // bright sky color
    "darkslategrey", // dim ground color
    3 // intensity
  );

  const mainLight = new DirectionalLight("white", 2);
  mainLight.position.set(10, 10, 10);

  scene.add(ambientLight, mainLight);
}

function createMeshes() {
  // create a Group to hold the pieces of the train
  const train = new Group();
  scene.add(train);

  const body = new MeshStandardMaterial({
    color: "firebrick",
    flatShading: true,
  });

  const noseGeometry = new CylinderBufferGeometry(0.75, 0.75, 3, 12);
  const nose = new Mesh(noseGeometry, body);
  nose.rotation.set(Math.PI / 2, 0, Math.PI / 2);
  nose.position.x = -1;

  const cabinGeometry = new BoxBufferGeometry(2, 2.25, 1.5);
  const cabin = new Mesh(cabinGeometry, body);
  cabin.position.set(1.5, 0.4, 0);

  train.add(cabin, nose);
}

function createRenderer() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.physicallyCorrectLights = true;
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  // add the automatically created <canvas> element to the page
  container.appendChild(renderer.domElement);
}

function update() {
  controls.update();
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

export default function init(containerID) {
  container = document.querySelector(containerID);

  scene = new Scene();
  scene.background = new Color(0x8fbcd4);

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
