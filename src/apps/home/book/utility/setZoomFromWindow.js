export function setZoomFromWindow(camera, controls) {
  const initialControlsY = controls.target.y;

  const setZoom = () => {
    if (
      window.matchMedia(
        '(max-width: 736px) and (orientation: portrait)',
      ).matches
    ) {
      camera.zoom = 0.7;
      controls.target.y = initialControlsY - 0.14;
      camera.updateProjectionMatrix();
    } else if (
      window.matchMedia(
        '(max-height: 736px) and (orientation: landscape)',
      ).matches
    ) {
      camera.zoom = 0.7;
      controls.target.y = initialControlsY - 0.16;
      camera.updateProjectionMatrix();
    } else if (camera.zoom < 1.0) {
      camera.zoom = 1;
      controls.target.y = initialControlsY;
      camera.updateProjectionMatrix();
    }
  };

  window.addEventListener('resize', () => {
    setZoom();
  });

  setZoom();
}
