import {
  AnimationMixer,
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  Vector3,
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

function createCamera() {
  camera = new PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    1,
    1000
  );
  camera.position.set(-1.5, 1.5, 6.5);
}

function createControls() {
  controls = new OrbitControls(camera, container);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.target.z = 2;
}

function createLights() {
  const ambientLight = new HemisphereLight(0xddeeff, 0x0f0e0d, 8);

  const mainLight = new DirectionalLight(0xffffff, 3);
  mainLight.position.set(10, 10, 10);

  scene.add(ambientLight, mainLight);
}

function loadModels() {
  const onLoad = (gltf, position) => {
    const bird = gltf.scene;
    bird.position.copy(position);

    const animation = gltf.animations[0];

    const mixer = new AnimationMixer(bird);
    mixers.push(mixer);

    const action = mixer.clipAction(animation);
    action.play();

    scene.add(bird);
  };

  const loader = new GLTFLoader();

  const parrotPosition = new Vector3(0, 0, 2.5);

  loader.load(
    "/examples/assets/models/Parrot.glb",
    (gltf) => onLoad(gltf, parrotPosition),
    null,
    null
  );

  const flamingoPosition = new Vector3(7.5, 0, -10);
  loader.load(
    "/examples/assets/models/Flamingo.glb",
    (gltf) => onLoad(gltf, flamingoPosition),
    null,
    null
  );

  const storkPosition = new Vector3(0, -2.5, -10);
  loader.load(
    "/examples/assets/models/Stork.glb",
    (gltf) => onLoad(gltf, storkPosition),
    null,
    null
  );
}

function createRenderer() {
  // create a WebGLRenderer and set its width and height
  renderer = new WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.physicallyCorrectLights = true;
  renderer.setPixelRatio(window.devicePixelRatio);

  // add the automatically created <canvas> element to the page
  container.appendChild(renderer.domElement);
}

function update() {
  const delta = clock.getDelta();

  mixers.forEach((mixer) => {
    mixer.update(delta);
  });
  controls.update(delta);
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
  loadModels();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });

  window.addEventListener("resize", onWindowResize);
}
