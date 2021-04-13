// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export default function addXmlfold( CodeMirror ) {

  const Pos = CodeMirror.Pos;

  function cmp( a, b ) {
    return a.line - b.line || a.ch - b.ch;
  }

  const nameStartChar = 'A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
  const nameChar = nameStartChar + '\-\:\.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
  const xmlTagStart = new RegExp( '<(/?)([' + nameStartChar + '][' + nameChar + ']*)', 'g' );

  function Iter( cm, line, ch, range ) {
    this.line = line;
    this.ch = ch;
    this.cm = cm;
    this.text = cm.getLine( line );
    this.min = range ? Math.max( range.from, cm.firstLine() ) : cm.firstLine();
    this.max = range ? Math.min( range.to - 1, cm.lastLine() ) : cm.lastLine();
  }

  function tagAt( iter, ch ) {
    const type = iter.cm.getTokenTypeAt( Pos( iter.line, ch ) );
    return type && /\btag\b/.test( type );
  }

  function nextLine( iter ) {
    if ( iter.line >= iter.max ) return;
    iter.ch = 0;
    iter.text = iter.cm.getLine( ++iter.line );
    return true;
  }

  function prevLine( iter ) {
    if ( iter.line <= iter.min ) return;
    iter.text = iter.cm.getLine( --iter.line );
    iter.ch = iter.text.length;
    return true;
  }

  function toTagEnd( iter ) {
    for ( ;; ) {
      const gt = iter.text.indexOf( '>', iter.ch );
      if ( gt == -1 ) {
        if ( nextLine( iter ) ) continue;
        else return;
      }
      if ( !tagAt( iter, gt + 1 ) ) {
        iter.ch = gt + 1;
        continue;
      }
      const lastSlash = iter.text.lastIndexOf( '/', gt );
      const selfClose = lastSlash > -1 && !/\S/.test( iter.text.slice( lastSlash + 1, gt ) );
      iter.ch = gt + 1;
      return selfClose ? 'selfClose' : 'regular';
    }
  }

  function toTagStart( iter ) {
    for ( ;; ) {
      const lt = iter.ch ? iter.text.lastIndexOf( '<', iter.ch - 1 ) : -1;
      if ( lt == -1 ) {
        if ( prevLine( iter ) ) continue;
        else return;
      }
      if ( !tagAt( iter, lt + 1 ) ) {
        iter.ch = lt;
        continue;
      }
      xmlTagStart.lastIndex = lt;
      iter.ch = lt;
      const match = xmlTagStart.exec( iter.text );
      if ( match && match.index == lt ) return match;
    }
  }

  function toNextTag( iter ) {
    for ( ;; ) {
      xmlTagStart.lastIndex = iter.ch;
      const found = xmlTagStart.exec( iter.text );
      if ( !found ) {
        if ( nextLine( iter ) ) continue;
        else return;
      }
      if ( !tagAt( iter, found.index + 1 ) ) {
        iter.ch = found.index + 1;
        continue;
      }
      iter.ch = found.index + found[ 0 ].length;
      return found;
    }
  }

  function toPrevTag( iter ) {
    for ( ;; ) {
      const gt = iter.ch ? iter.text.lastIndexOf( '>', iter.ch - 1 ) : -1;
      if ( gt == -1 ) {
        if ( prevLine( iter ) ) continue;
        else return;
      }
      if ( !tagAt( iter, gt + 1 ) ) {
        iter.ch = gt;
        continue;
      }
      const lastSlash = iter.text.lastIndexOf( '/', gt );
      const selfClose = lastSlash > -1 && !/\S/.test( iter.text.slice( lastSlash + 1, gt ) );
      iter.ch = gt + 1;
      return selfClose ? 'selfClose' : 'regular';
    }
  }

  function findMatchingClose( iter, tag ) {
    const stack = [];
    for ( ;; ) {
      const next = toNextTag( iter );
      var end;
      const startLine = iter.line;
      const startCh = iter.ch - ( next ? next[ 0 ].length : 0 );
      if ( !next || !( end = toTagEnd( iter ) ) ) return;
      if ( end == 'selfClose' ) continue;
      if ( next[ 1 ] ) { // closing tag
        for ( var i = stack.length - 1; i >= 0; --i ) {
          if ( stack[ i ] == next[ 2 ] ) {
            stack.length = i;
            break;
          }
        }
        if ( i < 0 && ( !tag || tag == next[ 2 ] ) ) {
          return {
            tag: next[ 2 ],
            from: Pos( startLine, startCh ),
            to: Pos( iter.line, iter.ch ),
          };
        }
      } else { // opening tag
        stack.push( next[ 2 ] );
      }
    }
  }

  function findMatchingOpen( iter, tag ) {
    const stack = [];
    for ( ;; ) {
      const prev = toPrevTag( iter );
      if ( !prev ) return;
      if ( prev == 'selfClose' ) {
        toTagStart( iter );
        continue;
      }
      const endLine = iter.line;
      const endCh = iter.ch;
      const start = toTagStart( iter );
      if ( !start ) return;
      if ( start[ 1 ] ) { // closing tag
        stack.push( start[ 2 ] );
      } else { // opening tag
        for ( var i = stack.length - 1; i >= 0; --i ) {
          if ( stack[ i ] == start[ 2 ] ) {
            stack.length = i;
            break;
          }
        }
        if ( i < 0 && ( !tag || tag == start[ 2 ] ) ) {
          return {
            tag: start[ 2 ],
            from: Pos( iter.line, iter.ch ),
            to: Pos( endLine, endCh ),
          };
        }
      }
    }
  }

  CodeMirror.registerHelper( 'fold', 'xml', ( cm, start ) => {
    const iter = new Iter( cm, start.line, 0 );
    for ( ;; ) {
      const openTag = toNextTag( iter );
      if ( !openTag || iter.line != start.line ) return;
      const end = toTagEnd( iter );
      if ( !end ) return;
      if ( !openTag[ 1 ] && end != 'selfClose' ) {
        const startPos = Pos( iter.line, iter.ch );
        const endPos = findMatchingClose( iter, openTag[ 2 ] );
        return endPos && cmp( endPos.from, startPos ) > 0 ? {
          from: startPos,
          to: endPos.from,
        } : null;
      }
    }
  } );
  CodeMirror.findMatchingTag = function ( cm, pos, range ) {
    let iter = new Iter( cm, pos.line, pos.ch, range );
    if ( iter.text.indexOf( '>' ) == -1 && iter.text.indexOf( '<' ) == -1 ) return;
    const end = toTagEnd( iter );
    const to = end && Pos( iter.line, iter.ch );
    const start = end && toTagStart( iter );
    if ( !end || !start || cmp( iter, pos ) > 0 ) return;
    const here = {
      from: Pos( iter.line, iter.ch ),
      to,
      tag: start[ 2 ],
    };
    if ( end == 'selfClose' ) {
      return {
        open: here,
        close: null,
        at: 'open',
      };
    }

    if ( start[ 1 ] ) { // closing tag
      return {
        open: findMatchingOpen( iter, start[ 2 ] ),
        close: here,
        at: 'close',
      };
    } // opening tag
    iter = new Iter( cm, to.line, to.ch, range );
    return {
      open: here,
      close: findMatchingClose( iter, start[ 2 ] ),
      at: 'open',
    };

  };

  CodeMirror.findEnclosingTag = function ( cm, pos, range, tag ) {
    const iter = new Iter( cm, pos.line, pos.ch, range );
    for ( ;; ) {
      const open = findMatchingOpen( iter, tag );
      if ( !open ) break;
      const forward = new Iter( cm, pos.line, pos.ch, range );
      const close = findMatchingClose( forward, open.tag );
      if ( close ) {
        return {
          open,
          close,
        };
      }
    }
  };

  // Used by addon/edit/closetag.js
  CodeMirror.scanForClosingTag = function ( cm, pos, name, end ) {
    const iter = new Iter( cm, pos.line, pos.ch, end ? {
      from: 0,
      to: end,
    } : null );
    return findMatchingClose( iter, name );
  };

}
