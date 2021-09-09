import {
  BoxBufferGeometry,
  Clock,
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

    this.clock = new Clock();

    this.createScene();
    this.createCamera();
    this.createLights();
    this.createMeshes();
    this.createRenderer();

    this.handleResize();
  }

  createCamera() {
    this.camera = new PerspectiveCamera(
      35, // fov = Field Of View
      //aspect ratio
      this.container.clientWidth / this.container.clientHeight,
      0.1, // near clipping plane
      100 // far clipping plane
    );

    this.camera.position.set(0, 0, 10);
  }

  createLights() {
    const light = new DirectionalLight("white", 15);

    light.position.set(10, 10, 10);

    this.scene.add(light);
  }

  createMeshes() {
    const geometry = new BoxBufferGeometry(2, 2, 2);
    const material = new MeshStandardMaterial({ color: "purple" });

    // convert the mesh into a member variable so that we can access
    // outside this function
    this.mesh = new Mesh(geometry, material);

    // add the mesh to the scene
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
    // a function that will be called every time the window gets resized.
    // Don't put any heavy computation in here!
    const onResize = () => {
      // set the aspect ratio to match the new browser window aspect ratio
      this.camera.aspect =
        this.container.clientWidth / this.container.clientHeight;

      // update the camera's frustum
      this.camera.updateProjectionMatrix();

      // update the size of the renderer AND the canvas
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      );

      this.renderer.setPixelRatio(window.devicePixelRatio);
    };

    // call the function once to setup initial sizes
    onResize();

    window.addEventListener("resize", onResize);
  }

  update() {
    // only call the getDelta function once per frame!
    const delta = this.clock.getDelta();

    console.log(`The last frame rendered in ${delta * 1000} milliseconds`);

    // increase the mesh's rotation each frame
    this.mesh.rotation.z += delta / 2;
    this.mesh.rotation.x += delta / 2;
    this.mesh.rotation.y += delta / 2;
  }

  render() {
    // render, or 'create a still image', of the scene
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    // start the animation loop
    this.renderer.setAnimationLoop(() => {
      // Everything inside here will run once per frame

      // update any animations
      this.update();

      // render a new frame
      this.render();
    });
  }
}

export { World };
