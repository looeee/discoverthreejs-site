// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export default function addBracefold( CodeMirror ) {

  CodeMirror.registerHelper( 'fold', 'brace', ( cm, start ) => {
    const line = start.line;
    const lineText = cm.getLine( line );
    let tokenType;

    function findOpening( openCh ) {
      for ( let at = start.ch, pass = 0; ; ) {
        const found = at <= 0 ? -1 : lineText.lastIndexOf( openCh, at - 1 );
        if ( found == -1 ) {
          if ( pass == 1 ) break;
          pass = 1;
          at = lineText.length;
          continue;
        }
        if ( pass == 1 && found < start.ch ) break;
        tokenType = cm.getTokenTypeAt( CodeMirror.Pos( line, found + 1 ) );
        if ( !/^(comment|string)/.test( tokenType ) ) return found + 1;
        at = found - 1;
      }
    }

    let startToken = '{';
    let endToken = '}';
    let startCh = findOpening( '{' );
    if ( startCh == null ) {
      startToken = '[', endToken = ']';
      startCh = findOpening( '[' );
    }

    if ( startCh == null ) return;
    let count = 1;
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
        if ( cm.getTokenTypeAt( CodeMirror.Pos( i, pos + 1 ) ) == tokenType ) {
          if ( pos == nextOpen ) ++count;
          else if ( !--count ) {
            end = i;
            endCh = pos;
            break outer;
          }
        }
        ++pos;
      }
    }
    if ( end == null || line == end ) return;
    return {
      from: CodeMirror.Pos( line, startCh ),
      to: CodeMirror.Pos( end, endCh ),
    };
  } );

  CodeMirror.registerHelper( 'fold', 'import', ( cm, start ) => {
    function hasImport( line ) {
      if ( line < cm.firstLine() || line > cm.lastLine() ) return null;
      let start = cm.getTokenAt( CodeMirror.Pos( line, 1 ) );
      if ( !/\S/.test( start.string ) ) start = cm.getTokenAt( CodeMirror.Pos( line, start.end + 1 ) );
      if ( start.type != 'keyword' || start.string != 'import' ) return null;
      // Now find closing semicolon, return its position
      for ( let i = line, e = Math.min( cm.lastLine(), line + 10 ); i <= e; ++i ) {
        const text = cm.getLine( i );
        const semi = text.indexOf( ';' );
        if ( semi != -1 ) {
          return {
            startCh: start.end,
            end: CodeMirror.Pos( i, semi ),
          };
        }
      }
    }

    const startLine = start.line;
    const has = hasImport( startLine );
    let prev;
    if ( !has || hasImport( startLine - 1 ) || ( ( prev = hasImport( startLine - 2 ) ) && prev.end.line
        == startLine - 1 ) ) {
      return null;
    }
    for ( var end = has.end; ; ) {
      const next = hasImport( end.line + 1 );
      if ( next == null ) break;
      end = next.end;
    }
    return {
      from: cm.clipPos( CodeMirror.Pos( startLine, has.startCh + 1 ) ),
      to: end,
    };
  } );

  CodeMirror.registerHelper( 'fold', 'include', ( cm, start ) => {
    function hasInclude( line ) {
      if ( line < cm.firstLine() || line > cm.lastLine() ) return null;
      let start = cm.getTokenAt( CodeMirror.Pos( line, 1 ) );
      if ( !/\S/.test( start.string ) ) start = cm.getTokenAt( CodeMirror.Pos( line, start.end + 1 ) );
      if ( start.type == 'meta' && start.string.slice( 0, 8 ) == '#include' ) return start.start + 8;
    }

    const startLine = start.line;
    const has = hasInclude( startLine );
    if ( has == null || hasInclude( startLine - 1 ) != null ) return null;
    for ( var end = startLine; ; ) {
      const next = hasInclude( end + 1 );
      if ( next == null ) break;
      ++end;
    }
    return {
      from: CodeMirror.Pos( startLine, has + 1 ),
      to: cm.clipPos( CodeMirror.Pos( end ) ),
    };
  } );

}
