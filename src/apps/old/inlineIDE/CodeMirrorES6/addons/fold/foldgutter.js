// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export default function addFoldgutter( CodeMirror ) {

  CodeMirror.defineOption( 'foldGutter', false, ( cm, val, old ) => {
    if ( old && old != CodeMirror.Init ) {
      cm.clearGutter( cm.state.foldGutter.options.gutter );
      cm.state.foldGutter = null;
      cm.off( 'gutterClick', onGutterClick );
      cm.off( 'change', onChange );
      cm.off( 'viewportChange', onViewportChange );
      cm.off( 'fold', onFold );
      cm.off( 'unfold', onFold );
      cm.off( 'swapDoc', onChange );
    }
    if ( val ) {
      cm.state.foldGutter = new State( parseOptions( val ) );
      updateInViewport( cm );
      cm.on( 'gutterClick', onGutterClick );
      cm.on( 'change', onChange );
      cm.on( 'viewportChange', onViewportChange );
      cm.on( 'fold', onFold );
      cm.on( 'unfold', onFold );
      cm.on( 'swapDoc', onChange );
    }
  } );

  const Pos = CodeMirror.Pos;

  function State( options ) {
    this.options = options;
    this.from = this.to = 0;
  }

  function parseOptions( opts ) {
    if ( opts === true ) opts = {};
    if ( opts.gutter == null ) opts.gutter = 'CodeMirror-foldgutter';
    if ( opts.indicatorOpen == null ) opts.indicatorOpen = 'CodeMirror-foldgutter-open';
    if ( opts.indicatorFolded == null ) opts.indicatorFolded = 'CodeMirror-foldgutter-folded';
    return opts;
  }

  function isFolded( cm, line ) {
    const marks = cm.findMarks( Pos( line, 0 ), Pos( line + 1, 0 ) );
    for ( let i = 0; i < marks.length; ++i ) {
      if ( marks[ i ].__isFold ) {
        const fromPos = marks[ i ].find( -1 );
        if ( fromPos && fromPos.line === line ) {
          return marks[ i ];
        }
      }
    }
  }

  function marker( spec ) {
    if ( typeof spec === 'string' ) {
      const elt = document.createElement( 'div' );
      elt.className = spec + ' CodeMirror-guttermarker-subtle';
      return elt;
    }
    return spec.cloneNode( true );

  }

  function updateFoldInfo( cm, from, to ) {
    const opts = cm.state.foldGutter.options;
    let cur = from;
    const minSize = cm.foldOption( opts, 'minFoldSize' );
    const func = cm.foldOption( opts, 'rangeFinder' );
    cm.eachLine( from, to, ( line ) => {
      let mark = null;
      if ( isFolded( cm, cur ) ) {
        mark = marker( opts.indicatorFolded );
      } else {
        const pos = Pos( cur, 0 );
        const range = func && func( cm, pos );
        if ( range && range.to.line - range.from.line >= minSize ) {
          mark = marker( opts.indicatorOpen );
        }
      }
      cm.setGutterMarker( line, opts.gutter, mark );
      ++cur;
    } );
  }

  function updateInViewport( cm ) {
    const vp = cm.getViewport();
    const state = cm.state.foldGutter;
    if ( !state ) return;
    cm.operation( () => {
      updateFoldInfo( cm, vp.from, vp.to );
    } );
    state.from = vp.from;
    state.to = vp.to;
  }

  function onGutterClick( cm, line, gutter ) {
    const state = cm.state.foldGutter;
    if ( !state ) return;
    const opts = state.options;
    if ( gutter != opts.gutter ) return;
    const folded = isFolded( cm, line );
    if ( folded ) folded.clear();
    else cm.foldCode( Pos( line, 0 ), opts );
  }

  function onChange( cm ) {
    const state = cm.state.foldGutter;
    if ( !state ) return;
    const opts = state.options;
    state.from = state.to = 0;
    clearTimeout( state.changeUpdate );
    state.changeUpdate = setTimeout( () => {
      updateInViewport( cm );
    }, opts.foldOnChangeTimeSpan || 600 );
  }

  function onViewportChange( cm ) {
    const state = cm.state.foldGutter;
    if ( !state ) return;
    const opts = state.options;
    clearTimeout( state.changeUpdate );
    state.changeUpdate = setTimeout( () => {
      const vp = cm.getViewport();
      if ( state.from == state.to || vp.from - state.to > 20 || state.from - vp.to > 20 ) {
        updateInViewport( cm );
      } else {
        cm.operation( () => {
          if ( vp.from < state.from ) {
            updateFoldInfo( cm, vp.from, state.from );
            state.from = vp.from;
          }
          if ( vp.to > state.to ) {
            updateFoldInfo( cm, state.to, vp.to );
            state.to = vp.to;
          }
        } );
      }
    }, opts.updateViewportTimeSpan || 400 );
  }

  function onFold( cm, from ) {
    const state = cm.state.foldGutter;
    if ( !state ) return;
    const line = from.line;
    if ( line >= state.from && line < state.to ) {
      updateFoldInfo( cm, line, line + 1 );
    }
  }

}
