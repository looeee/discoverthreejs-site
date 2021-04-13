import THREE_APP from 'three-app';

import Loaders from './loaders/Loaders';
import LoadingManager from './loaders/LoadingManager';

import Meshes from './models/Meshes';

import FileParser from './files/FileParser';

import LoadingOverlay from './UI/LoadingOverlay';
import ControlsOverlay from './UI/ControlsOverlay';
import Upload from './UI/Upload';
import TestModels from './UI/TestModels';
import Reset from './UI/Reset';
import StatsOverlay from './UI/StatsOverlay';

import Camera from './scene/Camera';
import OrbitControls from './scene/OrbitControls';
import Lighting from './scene/Lighting';
import Renderer from './scene/Renderer';
import Scene from './scene/Scene';

// import Animation from './models/Animation';

THREE.Cache.enabled = true;

class Main {
  constructor() {
    const app = new THREE_APP('container');
    app.init();

    this.meshes = new Meshes();

    this.camera = new Camera(app);
    this.orbitControls = new OrbitControls(app);
    this.lighting = new Lighting(app);
    this.scene = new Scene(app);
    this.renderer = new Renderer(app, this.scene);

    this.loaders = new Loaders(app, this.meshes, this.camera);

    this.fileParser = new FileParser(app, this.loaders);

    this.testModels = new TestModels(app, this.loaders);
    this.loadingOverlay = new LoadingOverlay();
    this.upload = new Upload(app, this.fileParser);
    this.controlsOverlay = new ControlsOverlay(this.app);
    this.reset = new Reset(
      app,
      this.meshes,
      this.loadingOverlay,
      this.controlsOverlay,
    );

    this.loadingManager = new LoadingManager(
      app,
      this.loadingOverlay,
      this.controlsOverlay,
    );

    this.statsOverlay = new StatsOverlay(app);

    app.start();
  }
}

new Main();
