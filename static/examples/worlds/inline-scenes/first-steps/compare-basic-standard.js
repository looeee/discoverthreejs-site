import {
  BoxBufferGeometry,
  Color,
  DirectionalLight,
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

function animate() {
  // call animate recursively
  requestAnimationFrame(animate);

  // increase the mesh's rotation each frame
  meshA.rotation.z += 0.01;
  meshA.rotation.x += 0.01;
  meshA.rotation.y += 0.01;

  // increase the mesh's rotation each frame
  meshB.rotation.z += 0.01;
  meshB.rotation.x += 0.01;
  meshB.rotation.y += 0.01;

  // render, or 'create a still image', of the scene
  // this will create one still image / frame each time the animate
  // function calls itself
  renderer.render(scene, camera);

  controls.update();
}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {
  // update the size of the renderer AND the canvas
  renderer.setSize(container.clientWidth, container.clientHeight);

  camera.aspect = container.clientWidth / container.clientHeight;
}

export default function init(containerID) {
  // Get a reference to the container element that will hold our scene
  container = document.querySelector(containerID);

  // set up the options for a perspective camera
  const fov = 35; // fov = Field Of View
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 100;

  camera = new PerspectiveCamera(fov, aspect, near, far);

  controls = new OrbitControls(camera, container);
  controls.enableDamping = true;
  controls.enableZoom = false;

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set(0, 0, 10);

  // create a Scene
  scene = new Scene();
  // Set the background color
  scene.background = new Color(0x8fbcd4);

  // create a geometry
  const geometry = new BoxBufferGeometry(2, 2, 2);

  // create a purple Standard material
  const materialA = new MeshStandardMaterial({
    color: 0x800080,
  });

  const materialB = new MeshBasicMaterial({ color: 0x800080 });

  // create a Mesh containing the geometry and material
  meshA = new Mesh(geometry, materialA);
  meshA.position.set(-2, 0, 0);

  meshB = new Mesh(geometry, materialB);
  meshB.position.set(2, 0, 0);

  // add the mesh to the scene object
  scene.add(meshA, meshB);

  // Create a directional light
  const light = new DirectionalLight(0xffffff, 5.0);

  // move the light back and up a bit
  light.position.set(0, 3, 3);

  // remember to add the light to the scene
  scene.add(light);

  // create a WebGLRenderer and set its width and height
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  // add the automatically created <canvas> element to the page
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  animate();
}
