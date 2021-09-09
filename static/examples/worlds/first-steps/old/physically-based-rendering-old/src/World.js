import {
  BoxBufferGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

class World {
  constructor(container) {
    this.container = container;

    this.createScene();
    this.createCamera();
    this.createLights();
    this.createMeshes();
    this.createRenderer();
  }

  createCamera() {
    this.camera = new PerspectiveCamera(
      35, // fov = Field Of View
      //aspect ratio
      this.container.clientWidth / this.container.clientHeight,
      0.1, // near clipping plane
      100 // far clipping plane
    );

    // move the camera back so that we can view the scene
    this.camera.position.set(0, 0, 10);
  }

  createLights() {
    // Create a directional light
    const light = new DirectionalLight("white", 8);

    // move the light back and up a bit
    light.position.set(10, 10, 10);

    // add the light to the scene
    this.scene.add(light);
  }

  createMeshes() {
    const geometry = new BoxBufferGeometry(2, 2, 2);

    const material = new MeshStandardMaterial({ color: "purple" });

    const mesh = new Mesh(geometry, material);

    mesh.rotation.set(-0.5, -0.1, 0.8);

    this.scene.add(mesh);
  }

  createRenderer() {
    this.renderer = new WebGLRenderer();

    this.renderer.physicallyCorrectLights = true;

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.container.append(this.renderer.domElement);
  }

  createScene() {
    this.scene = new Scene();

    this.scene.background = new Color("skyblue");
  }

  start() {
    // render, or 'create a still image', of the scene
    this.renderer.render(this.scene, this.camera);
  }
}
export { World };
