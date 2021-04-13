// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export default function addMatchesonscroll( CodeMirror ) {

  CodeMirror.defineExtension( 'showMatchesOnScrollbar', function( query, caseFold, options ) {
    if ( typeof options === 'string' ) {
      options = {
        className: options,
      };
    }
    if ( !options ) options = {};
    return new SearchAnnotation( this, query, caseFold, options );
  } );

  function SearchAnnotation( cm, query, caseFold, options ) {
    this.cm = cm;
    this.options = options;
    const annotateOptions = {
      listenForChanges: false,
    };
    for ( const prop in options ) annotateOptions[ prop ] = options[ prop ];
    if ( !annotateOptions.className ) annotateOptions.className = 'CodeMirror-search-match';
    this.annotation = cm.annotateScrollbar( annotateOptions );
    this.query = query;
    this.caseFold = caseFold;
    this.gap = {
      from: cm.firstLine(),
      to: cm.lastLine() + 1,
    };
    this.matches = [];
    this.update = null;

    this.findMatches();
    this.annotation.update( this.matches );

    const self = this;
    cm.on( 'change', this.changeHandler = function( _cm, change ) {
      self.onChange( change );
    } );
  }

  const MAX_MATCHES = 1000;

  SearchAnnotation.prototype.findMatches = function() {
    if ( !this.gap ) return;
    for ( var i = 0; i < this.matches.length; i++ ) {
      var match = this.matches[ i ];
      if ( match.from.line >= this.gap.to ) break;
      if ( match.to.line >= this.gap.from ) this.matches.splice( i--, 1 );
    }
    const cursor = this.cm.getSearchCursor( this.query, CodeMirror.Pos( this.gap.from, 0 ), {
      caseFold: this.caseFold,
      multiline: this.options.multiline,
    } );
    const maxMatches = this.options && this.options.maxMatches || MAX_MATCHES;
    while ( cursor.findNext() ) {
      var match = {
        from: cursor.from(),
        to: cursor.to(),
      };
      if ( match.from.line >= this.gap.to ) break;
      this.matches.splice( i++, 0, match );
      if ( this.matches.length > maxMatches ) break;
    }
    this.gap = null;
  };

  function offsetLine( line, changeStart, sizeChange ) {
    if ( line <= changeStart ) return line;
    return Math.max( changeStart, line + sizeChange );
  }

  SearchAnnotation.prototype.onChange = function( change ) {
    const startLine = change.from.line;
    const endLine = CodeMirror.changeEnd( change )
      .line;
    const sizeChange = endLine - change.to.line;
    if ( this.gap ) {
      this.gap.from = Math.min( offsetLine( this.gap.from, startLine, sizeChange ), change.from.line );
      this.gap.to = Math.max( offsetLine( this.gap.to, startLine, sizeChange ), change.from.line );
    } else {
      this.gap = {
        from: change.from.line,
        to: endLine + 1,
      };
    }

    if ( sizeChange ) {
      for ( let i = 0; i < this.matches.length; i++ ) {
        const match = this.matches[ i ];
        const newFrom = offsetLine( match.from.line, startLine, sizeChange );
        if ( newFrom != match.from.line ) match.from = CodeMirror.Pos( newFrom, match.from.ch );
        const newTo = offsetLine( match.to.line, startLine, sizeChange );
        if ( newTo != match.to.line ) match.to = CodeMirror.Pos( newTo, match.to.ch );
      }
    }
    clearTimeout( this.update );
    const self = this;
    this.update = setTimeout( () => {
      self.updateAfterChange();
    }, 250 );
  };

  SearchAnnotation.prototype.updateAfterChange = function() {
    this.findMatches();
    this.annotation.update( this.matches );
  };

  SearchAnnotation.prototype.clear = function() {
    this.cm.off( 'change', this.changeHandler );
    this.annotation.clear();
  };
}
