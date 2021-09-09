import {
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Snake } from "./Snake.js";

class World {
  constructor(container) {
    this.container = container;

    this.clock = new Clock();

    this.createScene();
    this.createCamera();
    this.createCameraControls();
    this.createLights();
    this.createMeshes();
    this.createRenderer();

    this.handleResize();
  }

  createCamera() {
    this.camera = new PerspectiveCamera(
      35,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      100
    );

    this.camera.position.set(0, 0, 15);
  }

  createCameraControls() {
    this.controls = new OrbitControls(this.camera, this.container);
    this.controls.enableDamping = true;
  }

  createLights() {
    const ambientLight = new HemisphereLight(
      "white", // bright sky color
      "darkslategrey", // dim ground color
      8 // intensity
    );

    const mainLight = new DirectionalLight("white", 3);
    mainLight.position.set(10, 10, 10);

    this.scene.add(ambientLight, mainLight);
  }

  createMeshes() {
    this.snake = new Snake();

    this.scene.add(this.snake);
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({ antialias: true });

    this.renderer.physicallyCorrectLights = true;

    this.container.append(this.renderer.domElement);
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

    this.controls.update();

    this.meshesGroup.rotation.y -= delta / 2;
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

export { World };
