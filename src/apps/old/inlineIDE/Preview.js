export default class Preview {

  constructor( ideElement ) {

    this.buildHTML( ideElement );

  }

  buildHTML( ideElement ) {

    const container = document.createElement( 'div' );
    container.classList.add( 'panel', 'preview-panel' );
    ideElement.appendChild( container );

    const label = document.createElement( 'label' );
    label.textContent = 'Preview';
    label.setAttribute( 'for', 'preview-frame' );

    container.appendChild( label );

    this.frame = document.createElement( 'iframe' );
    this.frame.name = 'preview-frame';
    this.frame.classList.add( 'preview-frame' );

    container.appendChild( this.frame );

  }

  update( src ) {

    this.frame.src = src;

  }

}
