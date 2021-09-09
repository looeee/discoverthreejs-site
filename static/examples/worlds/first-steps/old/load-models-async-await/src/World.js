import {
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ModelLoader } from "./ModelLoader.js";

class World {
  constructor(container) {
    this.container = container;

    this.clock = new Clock();

    this.createScene();
    this.createCamera();
    this.createCameraControls();
    this.createLights();
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

    this.camera.position.set(-1.5, 1.5, 6.5);
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

  async loadModels() {
    const modelLoader = new ModelLoader();

    const setupModel = (gltfData, position) => {
      const model = gltfData.scene.children[0];
      model.position.copy(position);
      this.scene.add(model);
    };

    const [parrotData, flamingoData, storkData] = await modelLoader.loadModels([
      "/assets/models/Parrot.glb",
      "/assets/models/Flamingo.glb",
      "/assets/models/Stork.glb",
    ]);

    if (parrotData.status === "failed") {
      console.error("Parrot.glb failed to load");
    } else {
      setupModel(parrotData, new Vector3(0, 0, 2.5));
    }

    if (flamingoData.status === "failed") {
      console.error("Flamingo.glb failed to load");
    } else {
      setupModel(flamingoData, new Vector3(7.5, 0, -1));
    }

    if (storkData.status === "failed") {
      console.error("Stork.glb failed to load");
    } else {
      setupModel(storkData, new Vector3(0, -2.5, -10));
    }
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
