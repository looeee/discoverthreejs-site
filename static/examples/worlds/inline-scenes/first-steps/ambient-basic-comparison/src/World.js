import {
  BoxBufferGeometry,
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

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

    this.camera.position.set(5, 2.5, -2);
  }

  createCameraControls() {
    this.controls = new OrbitControls(this.camera, this.container);
    this.controls.enableDamping = true;
  }

  createLights() {
    const ambientLight = new HemisphereLight(
      "white", // bright sky color
      "darkslategrey", // dim ground color
      10 // intensity
    );

    const mainLight = new DirectionalLight("white", 5);
    mainLight.position.set(10, 10, 10);

    this.scene.add(ambientLight, mainLight);
  }

  createMeshes() {
    const geometry = new BoxBufferGeometry(2, 2, 2);

    const textureLoader = new TextureLoader();

    const texture = textureLoader.load("/assets/textures/uv-test-bw.png");

    const material = new MeshStandardMaterial({
      map: texture,
    });

    this.mesh = new Mesh(geometry, material);

    this.scene.add(this.mesh);
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

export { World };
