// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

/**
 * Tag-closer extension for CodeMirror.
 *
 * This extension adds an "autoCloseTags" option that can be set to
 * either true to get the default behavior, or an object to further
 * configure its behavior.
 *
 * These are supported options:
 *
 * `whenClosing` (default true)
 *   Whether to autoclose when the '/' of a closing tag is typed.
 * `whenOpening` (default true)
 *   Whether to autoclose the tag when the final '>' of an opening
 *   tag is typed.
 * `dontCloseTags` (default is empty tags for HTML, none for XML)
 *   An array of tag names that should not be autoclosed.
 * `indentTags` (default is block tags for HTML, none for XML)
 *   An array of tag names that should, when opened, cause a
 *   blank line to be added inside the tag, and the blank line and
 *   closing line to be indented.
 * `emptyTags` (default is none)
 *   An array of XML tag names that should be autoclosed with '/>'.
 *
 * See demos/closetag.html for a usage example.
 */

export default function addClosetag( CodeMirror ) {

  CodeMirror.defineOption( 'autoCloseTags', false, ( cm, val, old ) => {
    if ( old != CodeMirror.Init && old ) {
      cm.removeKeyMap( 'autoCloseTags' );
    }
    if ( !val ) return;
    const map = {
      name: 'autoCloseTags',
    };
    if ( typeof val !== 'object' || val.whenClosing ) {
      map[ "'/'" ] = function( cm ) {
        return autoCloseSlash( cm );
      };
    }
    if ( typeof val !== 'object' || val.whenOpening ) {
      map[ "'>'" ] = function( cm ) {
        return autoCloseGT( cm );
      };
    }
    cm.addKeyMap( map );
  } );

  const htmlDontClose = [ 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link',
    'meta', 'param',
    'source', 'track', 'wbr' ];
  const htmlIndent = [ 'applet', 'blockquote', 'body', 'button', 'div', 'dl', 'fieldset', 'form', 'frameset', 'h1',
    'h2', 'h3', 'h4',
    'h5', 'h6', 'head', 'html', 'iframe', 'layer', 'legend', 'object', 'ol', 'p', 'select', 'table', 'ul' ];

  function autoCloseGT( cm ) {
    if ( cm.getOption( 'disableInput' ) ) return CodeMirror.Pass;
    const ranges = cm.listSelections();
    const replacements = [];
    const opt = cm.getOption( 'autoCloseTags' );
    for ( var i = 0; i < ranges.length; i++ ) {
      if ( !ranges[ i ].empty() ) return CodeMirror.Pass;
      const pos = ranges[ i ].head;
      const tok = cm.getTokenAt( pos );
      const inner = CodeMirror.innerMode( cm.getMode(), tok.state );
      const state = inner.state;
      if ( inner.mode.name != 'xml' || !state.tagName ) return CodeMirror.Pass;

      const html = inner.mode.configuration == 'html';
      const dontCloseTags = ( typeof opt === 'object' && opt.dontCloseTags ) || ( html && htmlDontClose );
      const indentTags = ( typeof opt === 'object' && opt.indentTags ) || ( html && htmlIndent );

      let tagName = state.tagName;
      if ( tok.end > pos.ch ) tagName = tagName.slice( 0, tagName.length - tok.end + pos.ch );
      const lowerTagName = tagName.toLowerCase();
      // Don't process the '>' at the end of an end-tag or self-closing tag
      if ( !tagName ||
        tok.type == 'string' && ( tok.end != pos.ch || !/[\"\']/.test( tok.string.charAt( tok.string.length - 1 ) ) ||
          tok.string.length == 1 ) ||
        tok.type == 'tag' && state.type == 'closeTag' ||
        tok.string.indexOf( '/' ) == ( tok.string.length - 1 ) // match something like <someTagName />
        ||
        dontCloseTags && indexOf( dontCloseTags, lowerTagName ) > -1 ||
        closingTagExists( cm, tagName, pos, state, true ) ) {
        return CodeMirror.Pass;
      }

      const emptyTags = typeof opt === 'object' && opt.emptyTags;
      if ( emptyTags && indexOf( emptyTags, tagName ) > -1 ) {
        replacements[ i ] = {
          text: '/>',
          newPos: CodeMirror.Pos( pos.line, pos.ch + 2 ),
        };
        continue;
      }

      const indent = indentTags && indexOf( indentTags, lowerTagName ) > -1;
      replacements[ i ] = {
        indent,
        text: '>' + ( indent ? '\n\n' : '' ) + '</' + tagName + '>',
        newPos: indent ? CodeMirror.Pos( pos.line + 1, 0 ) : CodeMirror.Pos( pos.line, pos.ch + 1 ),
      };
    }

    const dontIndentOnAutoClose = ( typeof opt === 'object' && opt.dontIndentOnAutoClose );
    for ( var i = ranges.length - 1; i >= 0; i-- ) {
      const info = replacements[ i ];
      cm.replaceRange( info.text, ranges[ i ].head, ranges[ i ].anchor, '+insert' );
      const sel = cm.listSelections()
        .slice( 0 );
      sel[ i ] = {
        head: info.newPos,
        anchor: info.newPos,
      };
      cm.setSelections( sel );
      if ( !dontIndentOnAutoClose && info.indent ) {
        cm.indentLine( info.newPos.line, null, true );
        cm.indentLine( info.newPos.line + 1, null, true );
      }
    }
  }

  function autoCloseCurrent( cm, typingSlash ) {
    let ranges = cm.listSelections();
    const replacements = [];
    const head = typingSlash ? '/' : '</';
    const opt = cm.getOption( 'autoCloseTags' );
    const dontIndentOnAutoClose = ( typeof opt === 'object' && opt.dontIndentOnSlash );
    for ( var i = 0; i < ranges.length; i++ ) {
      if ( !ranges[ i ].empty() ) return CodeMirror.Pass;
      const pos = ranges[ i ].head;
      const tok = cm.getTokenAt( pos );
      const inner = CodeMirror.innerMode( cm.getMode(), tok.state );
      const state = inner.state;
      if ( typingSlash && ( tok.type == 'string' || tok.string.charAt( 0 ) != '<' ||
          tok.start != pos.ch - 1 ) ) {
        return CodeMirror.Pass;
      }
      // Kludge to get around the fact that we are not in XML mode
      // when completing in JS/CSS snippet in htmlmixed mode. Does not
      // work for other XML embedded languages (there is no general
      // way to go from a mixed mode to its current XML state).
      var replacement;
      if ( inner.mode.name != 'xml' ) {
        if ( cm.getMode()
          .name == 'htmlmixed' && inner.mode.name == 'javascript' ) {
          replacement = head + 'script';
        } else if ( cm.getMode()
          .name == 'htmlmixed' && inner.mode.name == 'css' ) {
          replacement = head + 'style';
        } else {
          return CodeMirror.Pass;
        }
      } else {
        if ( !state.context || !state.context.tagName ||
          closingTagExists( cm, state.context.tagName, pos, state ) ) {
          return CodeMirror.Pass;
        }
        replacement = head + state.context.tagName;
      }
      if ( cm.getLine( pos.line )
        .charAt( tok.end ) != '>' ) replacement += '>';
      replacements[ i ] = replacement;
    }
    cm.replaceSelections( replacements );
    ranges = cm.listSelections();
    if ( !dontIndentOnAutoClose ) {
      for ( var i = 0; i < ranges.length; i++ ) {
        if ( i == ranges.length - 1 || ranges[ i ].head.line < ranges[ i + 1 ].head.line ) {
          cm.indentLine( ranges[ i ].head.line );
        }
      }
    }
  }

  function autoCloseSlash( cm ) {
    if ( cm.getOption( 'disableInput' ) ) return CodeMirror.Pass;
    return autoCloseCurrent( cm, true );
  }

  CodeMirror.commands.closeTag = function( cm ) {
    return autoCloseCurrent( cm );
  };

  function indexOf( collection, elt ) {
    if ( collection.indexOf ) return collection.indexOf( elt );
    for ( let i = 0, e = collection.length; i < e; ++i ) {
      if ( collection[ i ] == elt ) return i;
    }
    return -1;
  }

  // If xml-fold is loaded, we use its functionality to try and verify
  // whether a given tag is actually unclosed.
  function closingTagExists( cm, tagName, pos, state, newTag ) {
    if ( !CodeMirror.scanForClosingTag ) return false;
    const end = Math.min( cm.lastLine() + 1, pos.line + 500 );
    const nextClose = CodeMirror.scanForClosingTag( cm, pos, null, end );
    if ( !nextClose || nextClose.tag != tagName ) return false;
    let cx = state.context;
    // If the immediate wrapping context contains onCx instances of
    // the same tag, a closing tag only exists if there are at least
    // that many closing tags of that type following.
    for ( var onCx = newTag ? 1 : 0; cx && cx.tagName == tagName; cx = cx.prev ) ++onCx;
    pos = nextClose.to;
    for ( let i = 1; i < onCx; i++ ) {
      const next = CodeMirror.scanForClosingTag( cm, pos, null, end );
      if ( !next || next.tag != tagName ) return false;
      pos = next.to;
    }
    return true;
  }
}
