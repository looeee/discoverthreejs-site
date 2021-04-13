// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export default function addFoldcode( CodeMirror ) {

  function doFold( cm, pos, options, force ) {
    if ( options && options.call ) {
      var finder = options;
      options = null;
    } else {
      var finder = getOption( cm, options, 'rangeFinder' );
    }
    if ( typeof pos === 'number' ) pos = CodeMirror.Pos( pos, 0 );
    const minSize = getOption( cm, options, 'minFoldSize' );

    function getRange( allowFolded ) {
      const range = finder( cm, pos );
      if ( !range || range.to.line - range.from.line < minSize ) return null;
      const marks = cm.findMarksAt( range.from );
      for ( let i = 0; i < marks.length; ++i ) {
        if ( marks[ i ].__isFold && force !== 'fold' ) {
          if ( !allowFolded ) return null;
          range.cleared = true;
          marks[ i ].clear();
        }
      }
      return range;
    }

    let range = getRange( true );
    if ( getOption( cm, options, 'scanUp' ) ) {
      while ( !range && pos.line > cm.firstLine() ) {
        pos = CodeMirror.Pos( pos.line - 1, 0 );
        range = getRange( false );
      }
    }
    if ( !range || range.cleared || force === 'unfold' ) return;

    const myWidget = makeWidget( cm, options );
    CodeMirror.on( myWidget, 'mousedown', ( e ) => {
      myRange.clear();
      CodeMirror.e_preventDefault( e );
    } );
    var myRange = cm.markText( range.from, range.to, {
      replacedWith: myWidget,
      clearOnEnter: getOption( cm, options, 'clearOnEnter' ),
      __isFold: true,
    } );
    myRange.on( 'clear', ( from, to ) => {
      CodeMirror.signal( cm, 'unfold', cm, from, to );
    } );
    CodeMirror.signal( cm, 'fold', cm, range.from, range.to );
  }

  function makeWidget( cm, options ) {
    let widget = getOption( cm, options, 'widget' );
    if ( typeof widget === 'string' ) {
      const text = document.createTextNode( widget );
      widget = document.createElement( 'span' );
      widget.appendChild( text );
      widget.className = 'CodeMirror-foldmarker';
    } else if ( widget ) {
      widget = widget.cloneNode( true );
    }
    return widget;
  }

  // Clumsy backwards-compatible interface
  CodeMirror.newFoldFunction = function ( rangeFinder, widget ) {
    return function ( cm, pos ) {
      doFold( cm, pos, {
        rangeFinder,
        widget,
      } );
    };
  };

  // New-style interface
  CodeMirror.defineExtension( 'foldCode', function ( pos, options, force ) {
    doFold( this, pos, options, force );
  } );

  CodeMirror.defineExtension( 'isFolded', function ( pos ) {
    const marks = this.findMarksAt( pos );
    for ( let i = 0; i < marks.length; ++i ) {
      if ( marks[ i ].__isFold ) return true;
    }
  } );

  CodeMirror.commands.toggleFold = function ( cm ) {
    cm.foldCode( cm.getCursor() );
  };
  CodeMirror.commands.fold = function ( cm ) {
    cm.foldCode( cm.getCursor(), null, 'fold' );
  };
  CodeMirror.commands.unfold = function ( cm ) {
    cm.foldCode( cm.getCursor(), null, 'unfold' );
  };
  CodeMirror.commands.foldAll = function ( cm ) {
    cm.operation( () => {
      for ( let i = cm.firstLine(), e = cm.lastLine(); i <= e; i++ ) {
        cm.foldCode( CodeMirror.Pos( i, 0 ), null, 'fold' );
      }
    } );
  };
  CodeMirror.commands.unfoldAll = function ( cm ) {
    cm.operation( () => {
      for ( let i = cm.firstLine(), e = cm.lastLine(); i <= e; i++ ) {
        cm.foldCode( CodeMirror.Pos( i, 0 ), null, 'unfold' );
      }
    } );
  };

  CodeMirror.registerHelper( 'fold', 'combine', function () {
    const funcs = Array.prototype.slice.call( arguments, 0 );
    return function ( cm, start ) {
      for ( let i = 0; i < funcs.length; ++i ) {
        const found = funcs[ i ]( cm, start );
        if ( found ) return found;
      }
    };
  } );

  CodeMirror.registerHelper( 'fold', 'auto', ( cm, start ) => {
    const helpers = cm.getHelpers( start, 'fold' );
    for ( let i = 0; i < helpers.length; i++ ) {
      const cur = helpers[ i ]( cm, start );
      if ( cur ) return cur;
    }
  } );

  const defaultOptions = {
    rangeFinder: CodeMirror.fold.auto,
    widget: '\u2194',
    minFoldSize: 0,
    scanUp: false,
    clearOnEnter: true,
  };

  CodeMirror.defineOption( 'foldOptions', null );

  function getOption( cm, options, name ) {
    if ( options && options[ name ] !== undefined ) {
      return options[ name ];
    }
    const editorOptions = cm.options.foldOptions;
    if ( editorOptions && editorOptions[ name ] !== undefined ) {
      return editorOptions[ name ];
    }
    return defaultOptions[ name ];
  }

  CodeMirror.defineExtension( 'foldOption', function ( options, name ) {
    return getOption( this, options, name );
  } );

}
