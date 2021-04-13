export default class Reset {
  constructor(app, meshes, loadingOverlay, controlsOverlay) {
    document
      .querySelector('#reset')
      .addEventListener('click', (e) => {
        e.preventDefault();

        Object.values(meshes.meshes).forEach((mesh) => {
          app.scene.remove(mesh);
        });

        controlsOverlay.hide();
        loadingOverlay.show();
      });
  }
}
