// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export default function addAnnotateScrollbar( CodeMirror ) {

  CodeMirror.defineExtension( 'annotateScrollbar', function ( options ) {
    if ( typeof options === 'string' ) {
      options = {
        className: options,
      };
    }
    return new Annotation( this, options );
  } );

  CodeMirror.defineOption( 'scrollButtonHeight', 0 );

  function Annotation( cm, options ) {
    this.cm = cm;
    this.options = options;
    this.buttonHeight = options.scrollButtonHeight || cm.getOption( 'scrollButtonHeight' );
    this.annotations = [];
    this.doRedraw = this.doUpdate = null;
    this.div = cm.getWrapperElement()
      .appendChild( document.createElement( 'div' ) );
    this.div.style.cssText = 'position: absolute; right: 0; top: 0; z-index: 7; pointer-events: none';
    this.computeScale();

    function scheduleRedraw( delay ) {
      clearTimeout( self.doRedraw );
      self.doRedraw = setTimeout( () => {
        self.redraw();
      }, delay );
    }

    var self = this;
    cm.on( 'refresh', this.resizeHandler = function () {
      clearTimeout( self.doUpdate );
      self.doUpdate = setTimeout( () => {
        if ( self.computeScale() ) scheduleRedraw( 20 );
      }, 100 );
    } );
    cm.on( 'markerAdded', this.resizeHandler );
    cm.on( 'markerCleared', this.resizeHandler );
    if ( options.listenForChanges !== false ) {
      cm.on( 'change', this.changeHandler = function () {
        scheduleRedraw( 250 );
      } );
    }
  }

  Annotation.prototype.computeScale = function () {
    const cm = this.cm;
    const hScale = ( cm.getWrapperElement()
      .clientHeight - cm.display.barHeight - this.buttonHeight * 2 )
      / cm.getScrollerElement()
        .scrollHeight;
    if ( hScale != this.hScale ) {
      this.hScale = hScale;
      return true;
    }
  };

  Annotation.prototype.update = function ( annotations ) {
    this.annotations = annotations;
    this.redraw();
  };

  Annotation.prototype.redraw = function ( compute ) {
    if ( compute !== false ) this.computeScale();
    const cm = this.cm;
    const hScale = this.hScale;

    const frag = document.createDocumentFragment();
    const anns = this.annotations;

    const wrapping = cm.getOption( 'lineWrapping' );
    const singleLineH = wrapping && cm.defaultTextHeight() * 1.5;
    let curLine = null;
    let curLineObj = null;

    function getY( pos, top ) {
      if ( curLine != pos.line ) {
        curLine = pos.line;
        curLineObj = cm.getLineHandle( curLine );
      }
      if ( ( curLineObj.widgets && curLineObj.widgets.length )
        || ( wrapping && curLineObj.height > singleLineH ) ) {
        return cm.charCoords( pos, 'local' )[ top ? 'top' : 'bottom' ];
      }
      const topY = cm.heightAtLine( curLineObj, 'local' );
      return topY + ( top ? 0 : curLineObj.height );
    }

    const lastLine = cm.lastLine();
    if ( cm.display.barWidth ) {
      for ( var i = 0, nextTop; i < anns.length; i++ ) {
        let ann = anns[ i ];
        if ( ann.to.line > lastLine ) continue;
        const top = nextTop || getY( ann.from, true ) * hScale;
        let bottom = getY( ann.to, false ) * hScale;
        while ( i < anns.length - 1 ) {
          if ( anns[ i + 1 ].to.line > lastLine ) break;
          nextTop = getY( anns[ i + 1 ].from, true ) * hScale;
          if ( nextTop > bottom + 0.9 ) break;
          ann = anns[ ++i ];
          bottom = getY( ann.to, false ) * hScale;
        }
        if ( bottom == top ) continue;
        const height = Math.max( bottom - top, 3 );

        const elt = frag.appendChild( document.createElement( 'div' ) );
        elt.style.cssText = 'position: absolute; right: 0px; width: ' + Math.max( cm.display.barWidth - 1, 2 )
          + 'px; top: '
          + ( top + this.buttonHeight ) + 'px; height: ' + height + 'px';
        elt.className = this.options.className;
        if ( ann.id ) {
          elt.setAttribute( 'annotation-id', ann.id );
        }
      }
    }
    this.div.textContent = '';
    this.div.appendChild( frag );
  };

  Annotation.prototype.clear = function () {
    this.cm.off( 'refresh', this.resizeHandler );
    this.cm.off( 'markerAdded', this.resizeHandler );
    this.cm.off( 'markerCleared', this.resizeHandler );
    if ( this.changeHandler ) this.cm.off( 'change', this.changeHandler );
    this.div.parentNode.removeChild( this.div );
  };

}
