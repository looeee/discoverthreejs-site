export default class LoadingManager {
  constructor(app, loadingOverlay, controlsOverlay) {
    THREE.DefaultLoadingManager.onLoad = () => {
      loadingOverlay.hide();
      controlsOverlay.show();
    };
  }
}
