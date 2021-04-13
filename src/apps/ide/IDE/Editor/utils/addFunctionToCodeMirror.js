import CodeMirror from 'codemirror';
// import CodeMirror from '../vendor/codemirror/codemirror.js';

// import { addMetaMode } from '../vendor/custom/CodeMirrorES6/modes/meta.js';
import { addHTMLMixedMode } from '../vendor/custom/CodeMirrorES6/modes/htmlmixed/htmlmixed.js';
import { addCSSMode } from '../vendor/custom/CodeMirrorES6/modes/css/css.js';
import { addXMLMode } from '../vendor/custom/CodeMirrorES6/modes/xml/xml.js';
import { addJavaScriptMode } from '../vendor/custom/CodeMirrorES6/modes/javascript/javascript.js';

// import { addSimpleScrollbar } from '../vendor/custom/CodeMirrorES6/addons/scroll/simplescrollbars.js';
import { addAnnotateScrollbar } from '../vendor/custom/CodeMirrorES6/addons/scroll/annotatescrollbar.js';

import { addComment } from '../vendor/custom/CodeMirrorES6/addons/comment/comment.js';
import { addFullscreen } from '../vendor/custom/CodeMirrorES6/addons/display/fullscreen.js';
// import { addAutorefresh } from '../vendor/custom/CodeMirrorES6/addons/display/autorefresh.js';

import { addActiveLine } from '../vendor/custom/CodeMirrorES6/addons/selection/active-line.js';

import { addDialog } from '../vendor/custom/CodeMirrorES6/addons/dialog/dialog.js';
import { addJumptoline } from '../vendor/custom/CodeMirrorES6/addons/search/jump-to-line.js';
import { addMatchhighlighter } from '../vendor/custom/CodeMirrorES6/addons/search/match-highlighter.js';
import { addMatchesonscroll } from '../vendor/custom/CodeMirrorES6/addons/search/matchesonscrollbar.js';
import { addSearch } from '../vendor/custom/CodeMirrorES6/addons/search/search.js';
import { addSearchcursor } from '../vendor/custom/CodeMirrorES6/addons/search/searchcursor.js';

import { addFoldcode } from '../vendor/custom/CodeMirrorES6/addons/fold/foldcode.js';
import { addBracefold } from '../vendor/custom/CodeMirrorES6/addons/fold/brace-fold.js';
import { addCommentfold } from '../vendor/custom/CodeMirrorES6/addons/fold/comment-fold.js';
import { addFoldgutter } from '../vendor/custom/CodeMirrorES6/addons/fold/foldgutter.js';
import { addIndentfold } from '../vendor/custom/CodeMirrorES6/addons/fold/indent-fold.js';
import { addXmlfold } from '../vendor/custom/CodeMirrorES6/addons/fold/xml-fold.js';

import { addClosebrackets } from '../vendor/custom/CodeMirrorES6/addons/edit/closebrackets.js';
import { addClosetag } from '../vendor/custom/CodeMirrorES6/addons/edit/closetag.js';

import { addShowhint } from '../vendor/custom/CodeMirrorES6/addons/hint/show-hint.js';
import { addAnywordhint } from '../vendor/custom/CodeMirrorES6/addons/hint/anyword-hint.js';
import { addXMLhint } from '../vendor/custom/CodeMirrorES6/addons/hint/xml-hint.js';
import { addCSSHint } from '../vendor/custom/CodeMirrorES6/addons/hint/css-hint.js';
import { addHTMLhint } from '../vendor/custom/CodeMirrorES6/addons/hint/html-hint.js';
import { addJShint } from '../vendor/custom/CodeMirrorES6/addons/hint/javascript-hint.js';

// import { addRunmode } from '../vendor/custom/CodeMirrorES6/addons/runmode/runmode.js';

function addFunctionsToCodeMirror() {
  // addMetaMode(CodeMirror);
  addXMLMode(CodeMirror);
  addCSSMode(CodeMirror);
  addJavaScriptMode(CodeMirror);
  addHTMLMixedMode(CodeMirror);

  // addSimpleScrollbar(CodeMirror);
  addAnnotateScrollbar(CodeMirror);

  addComment(CodeMirror);
  addFullscreen(CodeMirror);
  // addAutorefresh(CodeMirror);
  addActiveLine(CodeMirror);

  addDialog(CodeMirror);
  addJumptoline(CodeMirror);
  addMatchhighlighter(CodeMirror);
  addMatchesonscroll(CodeMirror);
  addSearch(CodeMirror);
  addSearchcursor(CodeMirror);

  addFoldcode(CodeMirror);
  addBracefold(CodeMirror);
  addCommentfold(CodeMirror);
  addFoldgutter(CodeMirror);
  addIndentfold(CodeMirror);
  addXmlfold(CodeMirror);

  addClosebrackets(CodeMirror);
  addClosetag(CodeMirror);

  addShowhint(CodeMirror);
  addAnywordhint(CodeMirror);
  addXMLhint(CodeMirror);
  addCSSHint(CodeMirror);
  addHTMLhint(CodeMirror);
  addJShint(CodeMirror);

  // addRunmode(CodeMirror);
}

export { addFunctionsToCodeMirror };
