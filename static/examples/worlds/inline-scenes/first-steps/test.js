import {
  AdditiveBlending,
  AnimationMixer,
  Clock,
  Float32BufferAttribute,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  sRGBEncoding,
  TextureLoader,
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
    100
  );
  camera.position.set(2, 2, 17);
}

function createControls() {
  controls = new OrbitControls(camera, container);
  controls.target.y = 3;
  controls.update();
}

function updateMorphTargets(points) {
  const geometry = points.geometry;
  let m;
  let ml;
  let name;

  const morphAttributes = geometry.morphAttributes;
  const keys = Object.keys(morphAttributes);

  if (keys.length > 0) {
    const morphAttribute = morphAttributes[keys[0]];

    if (morphAttribute !== undefined) {
      points.morphTargetInfluences = [];
      points.morphTargetDictionary = {};

      for (m = 0, ml = morphAttribute.length; m < ml; m++) {
        name = morphAttribute[m].name || String(m);

        points.morphTargetInfluences.push(0);
        points.morphTargetDictionary[name] = m;
      }
    }
  }
}

const sizesAttribute = new Float32BufferAttribute([], 1).setDynamic(true);

function loadModels() {
  const loader = new GLTFLoader();

  const map = new TextureLoader().load("/textures/sprites/spark1.png");

  const onLoad = (gltf) => {
    const model = gltf.scene.children[0];
    const animation = gltf.animations[0];

    const material = new PointsMaterial({
      map,
      // size: 0.75,
      color: 0xffffff,
      morphTargets: true,
      blending: AdditiveBlending,
      depthTest: false,
      // transparent: true,
      vertexColors: true,
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "uniform float size;",
        "attribute float size;"
      );
    };

    const positions = model.geometry.attributes.position;
    const count = positions.count;

    const sizes = [];
    for (let i = 0; i < count; i++) {
      sizes.push(1);
    }

    sizesAttribute.setArray(new Float32Array(sizes));
    sizesAttribute.needsUpdate = true;

    model.geometry.addAttribute("size", sizesAttribute);

    const points = new Points(model.geometry, material);

    updateMorphTargets(points);

    const mixer = new AnimationMixer(points);
    mixers.push(mixer);

    const action = mixer.clipAction(animation);
    action.play();

    points.rotation.y = Math.PI / 2;

    points.scale.multiplyScalar(0.03);

    scene.add(points);
  };

  const onError = (errorMessage) => {
    console.log(errorMessage);
  };

  loader.load(
    "examples/assets/models/Horse.glb",
    (gltf) => onLoad(gltf),
    null,
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

let time = 0;
const minPointSize = 0.75;

function update() {
  const delta = clock.getDelta();

  time += delta * 10;

  mixers.forEach((mixer) => {
    mixer.update(delta);
  });

  const count = sizesAttribute.count;

  for (let i = 0; i < count; i++) {
    sizesAttribute.array[i] = minPointSize + 0.5 * Math.sin(i + time);
  }

  sizesAttribute.needsUpdate = true;
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

  if (!container) return;

  scene = new Scene();

  createCamera();
  createControls();
  loadModels();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });

  window.addEventListener("resize", onWindowResize);
}
