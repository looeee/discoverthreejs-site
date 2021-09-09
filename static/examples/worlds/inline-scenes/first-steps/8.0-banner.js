import {
  AnimationMixer,
  Clock,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
} from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";

// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;

const mixers = [];
const clock = new Clock();

export default function init(containerID) {
  container = document.querySelector(containerID);

  scene = new Scene();

  createCamera();
  createControls();
  loadModels();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  camera = new PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    1,
    100
  );
  camera.position.set(2, 2, 17);
}

function createControls() {
  controls = new OrbitControls(camera, container);
  controls.target.y = 3;
  controls.update();
}

function loadModels() {
  const loader = new GLTFLoader();

  const onLoad = (gltf) => {
    const model = gltf.scene.children[0];

    const animation = gltf.animations[0];

    const mixer = new AnimationMixer(model);
    mixers.push(mixer);

    const action = mixer.clipAction(animation);
    action.play();

    model.rotation.y = Math.PI / 2;

    model.scale.multiplyScalar(0.03);

    model.material = new MeshBasicMaterial({
      wireframe: true,
      morphTargets: true,
    });

    scene.add(model);
  };

  const onProgress = () => {};

  const onError = (errorMessage) => {
    console.log(errorMessage);
  };

  loader.load(
    "/examples/assets/models/Horse.glb",
    (gltf) => onLoad(gltf),
    onProgress,
    onError
  );
}

function createRenderer() {
  renderer = new WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.gammaFactor = 2.2;
  renderer.outputEncoding = sRGBEncoding;

  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function update() {
  const delta = clock.getDelta();

  mixers.forEach((mixer) => {
    mixer.update(delta);
  });
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

window.addEventListener("resize", onWindowResize);
