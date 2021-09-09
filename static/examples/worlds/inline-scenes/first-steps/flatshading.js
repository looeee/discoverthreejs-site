import {
  AmbientLight,
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereBufferGeometry,
  WebGLRenderer,
} from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

// these need to be accessed inside more than one function so we'll declare them first
let container;
let renderer;
let camera;
let scene;
let controls;
let meshA;
let meshB;

function createCamera() {
  camera = new PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 2, 8);
}

function createControls() {
  controls = new OrbitControls(camera, container);
  controls.enablePan = false;
  controls.enableZoom = false;
}

function createLights() {
  const ambientLight = new AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const frontLight = new DirectionalLight(0xffffff, 1);
  frontLight.position.set(10, 10, 10);

  const backLight = new DirectionalLight(0xffffff, 1);
  backLight.position.set(-10, 10, -10);

  scene.add(frontLight, backLight);
}

function createMeshes() {
  const materialA = new MeshStandardMaterial({
    color: 0x800080,
  });

  const materialB = new MeshStandardMaterial({
    color: 0x800080,
    flatShading: true,
  });

  const geometry = new SphereBufferGeometry(1.5, 18, 10);

  meshA = new Mesh(geometry, materialA);
  meshA.position.x = -2;

  meshB = new Mesh(geometry, materialB);
  meshB.position.x = 2;

  scene.add(meshA, meshB);
}

function createRenderer() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);
}

function update() {
  meshA.rotation.y -= 0.005;
  meshB.rotation.y += 0.005;
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

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
