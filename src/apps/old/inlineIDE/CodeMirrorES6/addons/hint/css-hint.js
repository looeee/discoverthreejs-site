// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export default function addCSSHint( CodeMirror ) {

  const pseudoClasses = {
    link: 1,
    visited: 1,
    active: 1,
    hover: 1,
    focus: 1,
    'first-letter': 1,
    'first-line': 1,
    'first-child': 1,
    before: 1,
    after: 1,
    lang: 1,
  };

  CodeMirror.registerHelper( 'hint', 'css', ( cm ) => {
    const cur = cm.getCursor();
    const token = cm.getTokenAt( cur );
    const inner = CodeMirror.innerMode( cm.getMode(), token.state );
    if ( inner.mode.name != 'css' ) return;

    if ( token.type == 'keyword' && '!important'.indexOf( token.string ) == 0 ) {
      return {
        list: [ '!important' ],
        from: CodeMirror.Pos( cur.line, token.start ),
        to: CodeMirror.Pos( cur.line, token.end ),
      };
    }

    let start = token.start;
    let end = cur.ch;
    let word = token.string.slice( 0, end - start );
    if ( /[^\w$_-]/.test( word ) ) {
      word = '';
      start = end = cur.ch;
    }

    const spec = CodeMirror.resolveMode( 'text/css' );

    const result = [];

    function add( keywords ) {
      for ( const name in keywords ) {
        if ( !word || name.lastIndexOf( word, 0 ) == 0 ) { result.push( name ); }
      }
    }

    const st = inner.state.state;
    if ( st == 'pseudo' || token.type == 'variable-3' ) {
      add( pseudoClasses );
    } else if ( st == 'block' || st == 'maybeprop' ) {
      add( spec.propertyKeywords );
    } else if ( st == 'prop' || st == 'parens' || st == 'at' || st == 'params' ) {
      add( spec.valueKeywords );
      add( spec.colorKeywords );
    } else if ( st == 'media' || st == 'media_parens' ) {
      add( spec.mediaTypes );
      add( spec.mediaFeatures );
    }

    if ( result.length ) {
      return {
        list: result,
        from: CodeMirror.Pos( cur.line, start ),
        to: CodeMirror.Pos( cur.line, end ),
      };
    }
  } );

}
