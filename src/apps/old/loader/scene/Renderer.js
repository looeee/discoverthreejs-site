export default class Renderer {
  constructor( app, scene ) {

    this.renderer = app.renderer;
    this.scene = scene;

    this.gammaToggler();
    this.toneMappingToggler();

  }

  gammaToggler() {

    const button = document.querySelector( '#gamma-toggle' );

    button.addEventListener( 'click', () => {

      if ( this.renderer.gammaOutput === true ) {

        this.renderer.gammaOutput = false;
        button.textContent = 'gamma output: false';

      } else {

        this.renderer.gammaOutput = true;
        button.textContent = 'gamma output: true';

      }

      this.scene.updateMaterials();

    } );

  }

  toneMappingToggler() {

    let enabled = false;

    const button = document.querySelector( '#tonemapping-toggle' );

    button.addEventListener( 'click', () => {

      if ( enabled ) {

        this.renderer.toneMapping = THREE.LinearToneMapping;
        button.textContent = 'tone mapping: Linear';

      } else {

        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        button.textContent = 'tone mapping: ACES Filmic';

      }

      this.scene.updateMaterials();

      enabled = !enabled;

    } );

  }
}
