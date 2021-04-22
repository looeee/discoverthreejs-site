export function setupRendererFolder(gui, renderer) {
  const folder = gui.addFolder('Renderer');
  folder.open();

  const params = {
    toneMappingExposure: renderer.toneMappingExposure,
  };

  folder
    .add(params, 'toneMappingExposure', 0.01, 10.0, 0.001)
    .name('toneMappingExposure')
    .onChange(() => {
      renderer.toneMappingExposure = params.toneMappingExposure;
    });
}
