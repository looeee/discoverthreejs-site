import {
  BoxBufferGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "https://cdn.skypack.dev/three@0.132.2";

// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let renderer;
let scene;
let mesh;

function animate() {
  // call animate recursively
  requestAnimationFrame(animate);

  // render, or 'create a still image', of the scene
  // this will create one still image / frame each time the animate
  // function calls itself
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
  // Set the background color
  scene.background = new Color(0x8fbcd4);

  // set up the options for a perspective camera
  const fov = 35; // fov = Field Of View
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 100;

  camera = new PerspectiveCamera(fov, aspect, near, far);

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set(0, 0, 10);

  // create a geometry
  const geometry = new BoxBufferGeometry(2, 2, 2);

  // create a purple Standard material
  const material = new MeshStandardMaterial({
    color: 0x800080,
  });

  // create a Mesh containing the geometry and material
  mesh = new Mesh(geometry, material);

  mesh.rotation.set(-0.5, -0.1, 0.8);

  // add the mesh to the scene object
  scene.add(mesh);

  // Create a directional light
  const light = new DirectionalLight(0xffffff, 15.0);

  // move the light back and up a bit
  light.position.set(10, 10, 10);

  // remember to add the light to the scene
  scene.add(light);

  // create a WebGLRenderer and set its width and height
  renderer = new WebGLRenderer({ antialias: false });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.physicallyCorrectLights = true;

  // add the automatically created <canvas> element to the page
  container.appendChild(renderer.domElement);

  // window.addEventListener('resize', onWindowResize);

  animate();
}
