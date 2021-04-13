// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Depends on csslint.js from https://github.com/stubbornella/csslint

// declare global: CSSLint

( function ( mod ) {
  if ( typeof exports === 'object' && typeof module === 'object' ) // CommonJS
  {
    mod( require( '../../lib/codemirror' ) );
  } else if ( typeof define === 'function' && define.amd ) // AMD
  {
    define( [ '../../lib/codemirror' ], mod );
  } else // Plain browser env
  {
    mod( CodeMirror );
  }
}( ( CodeMirror ) => {


  CodeMirror.registerHelper( 'lint', 'css', ( text, options ) => {
    const found = [];
    if ( !window.CSSLint ) {
      if ( window.console ) {
        window.console.error( 'Error: window.CSSLint not defined, CodeMirror CSS linting cannot run.' );
      }
      return found;
    }
    const results = CSSLint.verify( text, options );
    const messages = results.messages;
    let message = null;
    for ( let i = 0; i < messages.length; i++ ) {
      message = messages[ i ];
      const startLine = message.line - 1;
      const endLine = message.line - 1;
      const startCol = message.col - 1;
      const endCol = message.col;
      found.push( {
        from: CodeMirror.Pos( startLine, startCol ),
        to: CodeMirror.Pos( endLine, endCol ),
        message: message.message,
        severity: message.type,
      } );
    }
    return found;
  } );

} ) );
