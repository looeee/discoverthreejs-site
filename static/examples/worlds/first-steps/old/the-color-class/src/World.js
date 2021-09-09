import {
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

class World {
  constructor(container) {
    this.container = container;

    this.createScene();
    this.createCamera();
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

  createMeshes() {
    // create a geometry
    const geometry = new BoxBufferGeometry(2, 2, 2);

    // create a purple Basic material
    const material = new MeshBasicMaterial({ color: "purple" });

    // create a Mesh containing the geometry and material
    const mesh = new Mesh(geometry, material);

    // add the mesh to the scene
    this.scene.add(mesh);
  }

  createRenderer() {
    // create a WebGLRenderer and set its width and height
    this.renderer = new WebGLRenderer();

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.renderer.setPixelRatio(window.devicePixelRatio);

    // add the automatically created <canvas> element to the page
    this.container.append(this.renderer.domElement);
  }

  createScene() {
    // create a Scene
    this.scene = new Scene();

    this.scene.background = new Color("skyblue");
  }

  start() {
    // render, or 'create a still image', of the scene
    this.renderer.render(this.scene, this.camera);
  }
}
export { World };
