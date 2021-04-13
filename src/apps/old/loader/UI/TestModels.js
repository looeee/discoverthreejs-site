export default class TestModels {
  constructor(app, loaders) {
    document
      .querySelector('#load-gltf')
      .addEventListener('click', () => {
        loaders.loadGLTF(
          'https://threejs.org/examples/models/gltf/LittlestTokyo.glb',
        );
      });

    document
      .querySelector('#load-fbx')
      .addEventListener('click', () => {
        loaders.loadFBX(
          'https://threejs.org/examples/models/fbx/Samba Dancing.fbx',
        );
      });

    // document.querySelector( '#load-dae' ).addEventListener( 'click', () => {

    //   loaders.loadDAE( 'https://threejs.org/examples/models/collada/kawada-hironx.dae' );

    // } );
  }
}
