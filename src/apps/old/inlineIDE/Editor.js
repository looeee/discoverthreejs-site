import CodeMirror from 'codemirror';
// import CodeMirror from './vendor/codemirror/codemirror.js';

import addHTMLMixedMode from './CodeMirrorES6/modes/htmlmixed/htmlmixed.js';
import addCSSMode from './CodeMirrorES6/modes/css/css.js';
import addXMLMode from './CodeMirrorES6/modes/xml/xml.js';
import addJavaScriptMode from './CodeMirrorES6/modes/javascript/javascript.js';

import addSimpleScrollbar from './CodeMirrorES6/addons/scroll/simplescrollbars.js';
import addAnnotateScrollbar from './CodeMirrorES6/addons/scroll/annotatescrollbar.js';

import addComment from './CodeMirrorES6/addons/comment/comment.js';
import addFullscreen from './CodeMirrorES6/addons/display/fullscreen.js';
import addActiveLine from './CodeMirrorES6/addons/selection/active-line.js';

import addDialog from './CodeMirrorES6/addons/dialog/dialog.js';
import addJumptoline from './CodeMirrorES6/addons/search/jump-to-line.js';
import addMatchhighlighter from './CodeMirrorES6/addons/search/match-highlighter.js';
import addMatchesonscroll from './CodeMirrorES6/addons/search/matchesonscrollbar.js';
import addSearch from './CodeMirrorES6/addons/search/search.js';
import addSearchcursor from './CodeMirrorES6/addons/search/searchcursor.js';

import addFoldcode from './CodeMirrorES6/addons/fold/foldcode.js';
import addBracefold from './CodeMirrorES6/addons/fold/brace-fold.js';
import addCommentfold from './CodeMirrorES6/addons/fold/comment-fold.js';
import addFoldgutter from './CodeMirrorES6/addons/fold/foldgutter.js';
import addIndentfold from './CodeMirrorES6/addons/fold/indent-fold.js';
import addXmlfold from './CodeMirrorES6/addons/fold/xml-fold.js';

import addClosebrackets from './CodeMirrorES6/addons/edit/closebrackets.js';
import addClosetag from './CodeMirrorES6/addons/edit/closetag.js';

import addShowhint from './CodeMirrorES6/addons/hint/show-hint.js';
import addAnywordhint from './CodeMirrorES6/addons/hint/anyword-hint.js';
import addXMLhint from './CodeMirrorES6/addons/hint/xml-hint.js';
import addCSSHint from './CodeMirrorES6/addons/hint/css-hint.js';
import addHTMLhint from './CodeMirrorES6/addons/hint/html-hint.js';
import addJShint from './CodeMirrorES6/addons/hint/javascript-hint.js';

import getMimetype from './utils/getMimetype';

addXMLMode( CodeMirror );
addCSSMode( CodeMirror );
addJavaScriptMode( CodeMirror );
addHTMLMixedMode( CodeMirror );

addSimpleScrollbar( CodeMirror );
addAnnotateScrollbar( CodeMirror );

addComment( CodeMirror );
addFullscreen( CodeMirror );
addActiveLine( CodeMirror );

addDialog( CodeMirror );
addJumptoline( CodeMirror );
addMatchhighlighter( CodeMirror );
addMatchesonscroll( CodeMirror );
addSearch( CodeMirror );
addSearchcursor( CodeMirror );

addFoldcode( CodeMirror );
addBracefold( CodeMirror );
addCommentfold( CodeMirror );
addFoldgutter( CodeMirror );
addIndentfold( CodeMirror );
addXmlfold( CodeMirror );

addClosebrackets( CodeMirror );
addClosetag( CodeMirror );

addShowhint( CodeMirror );
addAnywordhint( CodeMirror );
addXMLhint( CodeMirror );
addCSSHint( CodeMirror );
addHTMLhint( CodeMirror );
addJShint( CodeMirror );

let editor;

export default class Editor {

  constructor( ideElement, files ) {

    this.files = files;

    const textArea = this.buildHTML( ideElement );

    editor = CodeMirror.fromTextArea( textArea, {

      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      mode: 'text/html',
      theme: 'ambiance',
      flattenSpans: true,
      spellcheck: true,
      scrollbarStyle: 'simple',
      autoCloseTags: true,
      autoCloseBrackets: true,
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'Cmd-Space': 'autocomplete',
        'Ctrl-Q': ( cm ) => {
          cm.foldCode( cm.getCursor() );
        },
        'Cmd-Q': ( cm ) => {
          cm.foldCode( cm.getCursor() );
        },
        'Cmd-/': 'toggleComment',
        'Ctrl-/': 'toggleComment',
        F11( cm ) {
          cm.setOption( 'fullScreen', !cm.getOption( 'fullScreen' ) );
        },
        Esc( cm ) {
          if ( cm.getOption( 'fullScreen' ) ) cm.setOption( 'fullScreen', false );
        },

      },
      foldGutter: true,
      gutters: [ 'CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers' ],
      lint: true,

    } );

    this.setupDocuments();

  }

  buildHTML( ideElement ) {

    const container = document.createElement( 'div' );
    container.classList.add( 'panel', 'editor-panel' );
    ideElement.appendChild( container );

    this.label = document.createElement( 'label' );
    this.label.textContent = 'Editor';
    this.label.setAttribute( 'for', 'editor-textarea' );

    container.appendChild( this.label );

    const textArea = document.createElement( 'textarea' );
    textArea.name = 'editor-textarea';
    textArea.classList.add( 'editor-textarea' );

    container.appendChild( textArea );

    return textArea;

  }

  setupDocuments() {

    this.documents = {};

    for ( const key of Object.keys( this.files ) ) {

      this.documents[ key ] = null;

    }

  }

  getDocument( file ) {

    if ( this.documents[ file.url ] === null ) {

      console.log( getMimetype( file.type ) );

      this.documents[ file.url ] = CodeMirror.Doc( file.text, getMimetype( file.type ) );

    }

    return this.documents[ file.url ];

  }

  getFileContents( file ) {

    if ( this.documents[ file.url ] === null ) return file.text;
    return this.documents[ file.url ].getValue();

  }

  setActiveDocument( file ) {

    editor.swapDoc( this.getDocument( file ) );
    editor.refresh();

  }

  setEventCallback( eventType, callback ) {

    editor.on( eventType, callback );

  }

  reset( file ) {

    if ( this.documents[ file.url ] && !this.documents[ file.url ].isClean() ) {

      this.documents[ file.url ].setValue( file.text );

    }

  }

  resetAll() {

    for ( const file of this.file ) {

      this.reset( file );

    }
  }

}
