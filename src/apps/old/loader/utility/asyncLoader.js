export default (loader) => async (url) =>
  new Promise((resolve, reject) => {
    loader.load(
      url,
      resolve,
      THREE.DefaultLoadingManager.onProgress,
      () => {
        reject(new Error('Failed to load file "' + url + '".'));
      },
    );
  });
