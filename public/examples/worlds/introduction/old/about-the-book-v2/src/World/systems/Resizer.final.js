class Resizer {
  constructor(container, camera, renderer) {
    const setSize = () => {
      // Set the camera's aspect ratio
      camera.aspect = container.clientWidth / container.clientHeight;

      // update the camera's frustum
      camera.updateProjectionMatrix();

      // update the size of the renderer AND the canvas
      renderer.setSize(container.clientWidth, container.clientHeight);

      // set the pixel ratio (for mobile devices)
      renderer.setPixelRatio(window.devicePixelRatio);
    };

    // set initial size
    setSize();

    window.addEventListener('resize', () => {
      // set the size again if a resize occurs
      setSize();
      // perform any custom actions
      this.onResize();
    });
  }

  onResize() {}
}

export { Resizer };
