import {
  ACESFilmicToneMapping,
  Clock,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Stats from './stats.js';

// private variable that user can access via app.isRunning
let _isRunning = false;

// spec object, all arguments are optional
// const spec = {

//   container: '#container', // ID or class string, or DOM element
//   autoResize: true,
//   showStats: false, // also requires Stats.js to be loaded

//   renderer: {
//     alpha: false,
//     antialias: true,
//     powerPreference: 'high-performance',
//     stencil: false,

//     // set this to a value less than 3 to increase performance on low power mobile devices with high pixel ratio
//     maxPixelRatio: Infinity,

//     // should always be true when using a physically based workflow
//     physicallyCorrectLights: true,

//   },

//   camera: {
//     fov: 35,
//     near: 1,
//     far: 1000,
//   },

//   controls: {
//     // whether or not to call the controls.update function once per frame
//     setupOrbitControls: true,
//     autoUpdate: true,
//   },

// };
//

export class App {
  constructor(spec) {
    this.spec = spec || {};

    this.initContainer(spec.container || '#scene-container'); // default ID if none provided

    this.scene = new Scene();
    this.clock = new Clock();

    // optional function evaluated once per frame
    this.onUpdate = null;

    // optional functional evaluated on window resize event
    // if spec.autoResize is true
    this.onResize = null;
  }

  get isRunning() {
    return _isRunning;
  }

  // container can either be a string or DOM element
  initContainer(container) {
    if (typeof container === 'string')
      this.container = document.querySelector(container);
    else this.container = container;

    if (!this.container)
      console.error(
        `Couldn't find the container element: ${container}`,
      );
  }

  init() {
    this.initCamera();
    this.initControls();
    this.initRenderer();

    this.initStats();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initCamera() {
    // allow custom controls to be set up
    if (this.camera) return;

    // setup camera spec, overwriting with user defined values if provided
    this.spec.camera = {
      ...{
        fov: 35,
        near: 0.1,
        far: 1000,
      },
      ...this.spec.camera,
    };

    this.camera = new PerspectiveCamera(
      this.spec.camera.fov,
      this.container.clientWidth / this.container.clientHeight,
      this.spec.camera.near,
      this.spec.camera.far,
    );
  }

  initControls() {
    // allow custom controls to be set up
    if (this.controls) return;

    // setup controls spec, overwriting with user defined values if provided
    this.spec.controls = {
      ...{
        setupOrbitControls: true,
        autoUpdate: true,
      },
      ...this.spec.controls,
    };

    // if the controls script was loaded, we'll set them up
    if (
      typeof OrbitControls === 'function' &&
      this.spec.controls.setupOrbitControls
    )
      this.controls = new OrbitControls(this.camera, this.container);
    // otherwise we'll skip them
    else return;

    // gives the controls a feeling of "weight"
    this.controls.enableDamping = true;
  }

  initRenderer() {
    // allow custom renderer to be set up
    if (this.renderer) return;

    // overwrite default spec with any user provided values
    this.spec.renderer = {
      ...{
        alpha: false,
        antialias: true,
        powerPreference: 'high-performance',
        stencil: false,
        maxPixelRatio: Infinity,
        toneMapping: ACESFilmicToneMapping,
        outputEncoding: sRGBEncoding,
        physicallyCorrectLights: true,
      },
      ...this.spec.renderer,
    };

    this.renderer = new WebGLRenderer({
      powerPreference: this.spec.renderer.powerPreference,
      alpha: this.spec.renderer.alpha,
      antialias: this.spec.renderer.antialias,
      stencil: this.spec.renderer.stencil,
    });

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
    this.renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        this.spec.renderer.maxPixelRatio,
      ),
    );

    this.renderer.toneMapping = this.spec.renderer.toneMapping;
    this.renderer.outputEncoding = this.spec.renderer.outputEncoding;

    this.renderer.physicallyCorrectLights = this.spec.renderer.physicallyCorrectLights;

    // to avoid page pulling
    this.renderer.domElement.addEventListener('touchstart', (e) =>
      e.preventDefault(),
    );

    this.container.appendChild(this.renderer.domElement);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    const delta = this.clock.getDelta();

    if (
      this.spec.controls.autoUpdate &&
      this.controls &&
      this.controls.update
    )
      this.controls.update(delta);

    // step through the scene and call custom onUpdate functions on any object
    // for which we have defined them
    this.scene.traverse((child) => {
      if (child.userData.onUpdate) child.userData.onUpdate(delta);
    });

    if (this.onUpdate) this.onUpdate(delta);
  }

  start() {
    // clear previous delta to prevent large delta values when
    // starting and stopping the app
    this.clock.getDelta();

    this.renderer.setAnimationLoop(() => {
      if (this.stats && this.spec.showStats) this.stats.begin();

      this.update();
      this.render();

      if (this.stats && this.spec.showStats) this.stats.end();
    });

    _isRunning = true;
  }

  stop() {
    this.renderer.setAnimationLoop(null);

    _isRunning = false;
  }

  onWindowResize() {
    if (!this.spec.autoResize === false) return;

    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
    this.renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        this.spec.renderer.maxPixelRatio,
      ),
    );

    // render an extra frame to prevent jank
    this.renderer.render(this.scene, this.camera);

    if (this.onResize) this.onResize();
  }

  initStats() {
    if (!this.spec.showStats) return;

    if (typeof Stats === 'undefined') {
      console.warn(
        'The stats.js script is required to show the stats overlay. Please make sure that it has been loaded correctly, or set app.spec.stats to false.',
      );
      return;
    }

    this.stats = new Stats();

    this.container.appendChild(this.stats.dom);
  }
}
