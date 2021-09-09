import {
  Clock,
  Color,
  HemisphereLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { Snake } from "./modules/Snake.js";

class World {
  constructor(containerID) {
    this.container = document.querySelector(containerID);

    this.clock = new Clock();

    this.createScene();
    this.createCamera();
    this.createCameraControls();
    this.createLights();
    this.createMeshes();
    this.createRenderer();

    this.handleResize();

    this.container.append(this.renderer.domElement);
  }

  createCamera() {
    this.camera = new PerspectiveCamera(
      35,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      100
    );

    this.camera.position.set(-3, 0, 2);
  }

  createCameraControls() {
    this.controls = new OrbitControls(this.camera, this.container);
    this.controls.enableDamping = true;
    this.controls.target.x = -1.5;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
  }

  createLights() {
    const ambientLight = new HemisphereLight(
      "white", // bright sky color
      "darkslategrey", // dim ground color
      10 // intensity
    );

    const mainLight = new PointLight("white", 15);

    this.scene.add(ambientLight, mainLight);
  }

  createMeshes() {
    this.meshGroup = new Snake();

    this.scene.add(this.meshGroup);
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({ antialias: true });

    this.renderer.physicallyCorrectLights = true;
  }

  createScene() {
    this.scene = new Scene();
    this.scene.background = new Color("skyblue");
  }

  handleResize() {
    // Don't put any heavy computation in here!
    const onResize = () => {
      this.camera.aspect =
        this.container.clientWidth / this.container.clientHeight;

      this.camera.updateProjectionMatrix();

      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      );

      this.renderer.setPixelRatio(window.devicePixelRatio);
    };

    onResize();

    window.addEventListener("resize", onResize);
  }

  update() {
    // only call the getDelta function once per frame!
    const delta = this.clock.getDelta();

    this.meshGroup.rotation.z -= delta / 2;

    this.controls.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.update();
      this.render();
    });
  }
}

export default function init(containerID) {
  // create a new three.js scene
  const world = new World(containerID);

  // draw the scene
  world.start();
}
