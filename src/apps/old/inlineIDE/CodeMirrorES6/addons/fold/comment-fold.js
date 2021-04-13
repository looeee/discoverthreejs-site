// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export default function addCommentfold( CodeMirror ) {

  CodeMirror.registerGlobalHelper( 'fold', 'comment', ( mode ) => {
    return mode.blockCommentStart && mode.blockCommentEnd;
  }, ( cm, start ) => {
    const mode = cm.getModeAt( start );
    const startToken = mode.blockCommentStart;
    const endToken = mode.blockCommentEnd;
    if ( !startToken || !endToken ) return;
    const line = start.line;
    const lineText = cm.getLine( line );

    let startCh;
    for ( let at = start.ch, pass = 0; ; ) {
      const found = at <= 0 ? -1 : lineText.lastIndexOf( startToken, at - 1 );
      if ( found == -1 ) {
        if ( pass == 1 ) return;
        pass = 1;
        at = lineText.length;
        continue;
      }
      if ( pass == 1 && found < start.ch ) return;
      if ( /comment/.test( cm.getTokenTypeAt( CodeMirror.Pos( line, found + 1 ) ) )
        && ( found == 0 || lineText.slice( found - endToken.length, found ) == endToken
          || !/comment/.test( cm.getTokenTypeAt( CodeMirror.Pos( line, found ) ) ) ) ) {
        startCh = found + startToken.length;
        break;
      }
      at = found - 1;
    }

    let depth = 1;
    const lastLine = cm.lastLine();
    let end;
    let endCh;
    outer: for ( let i = line; i <= lastLine; ++i ) {
      const text = cm.getLine( i );
      let pos = i == line ? startCh : 0;
      for ( ;; ) {
        let nextOpen = text.indexOf( startToken, pos );
        let nextClose = text.indexOf( endToken, pos );
        if ( nextOpen < 0 ) nextOpen = text.length;
        if ( nextClose < 0 ) nextClose = text.length;
        pos = Math.min( nextOpen, nextClose );
        if ( pos == text.length ) break;
        if ( pos == nextOpen ) ++depth;
        else if ( !--depth ) {
          end = i;
          endCh = pos;
          break outer;
        }
        ++pos;
      }
    }
    if ( end == null || line == end && endCh == startCh ) return;
    return {
      from: CodeMirror.Pos( line, startCh ),
      to: CodeMirror.Pos( end, endCh ),
    };
  } );

}
