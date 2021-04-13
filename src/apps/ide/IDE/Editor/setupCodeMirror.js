import CodeMirror from 'codemirror';

import { addFunctionsToCodeMirror } from './utils/addFunctionToCodeMirror.js';

function setupCodeMirror(textArea) {
  addFunctionsToCodeMirror();

  return CodeMirror.fromTextArea(textArea, {
    // autoRefresh: true, // doesn't work
    // scrollbarStyle: 'native',
    // scrollbarStyle: 'simple',
    // scrollbarStyle: 'null',
    // theme: 'ambiance',
    autoCloseBrackets: true,
    autoCloseTags: true,
    autoFocus: true,
    autoCorrect: true,
    flattenSpans: true,
    foldGutter: true,
    lineNumbers: true,
    lint: true,
    matchBrackets: true,
    mode: 'text/html',
    pollInterval: 200,
    resetSelectionOnContextMenu: false,
    screenReaderLabel: 'Inline Code Editor Text Area',
    showCursorWhenSelecting: false,
    smartIndent: true,
    spellcheck: true,
    styleActiveLine: true,
    tabIndex: 2,
    tabSize: 2,
    // lineWrapping: true,
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
      'Cmd-Space': 'autocomplete',
      'Ctrl-Q': (cm) => {
        cm.foldCode(cm.getCursor());
      },
      'Cmd-Q': (cm) => {
        cm.foldCode(cm.getCursor());
      },
      'Cmd-/': 'toggleComment',
      'Ctrl-/': 'toggleComment',
      F11(cm) {
        cm.setOption('fullScreen', !cm.getOption('fullScreen'));
      },
      Esc(cm) {
        if (cm.getOption('fullScreen'))
          cm.setOption('fullScreen', false);
      },
    },
    gutters: [
      'CodeMirror-linenumbers',
      'CodeMirror-foldgutter',
      'CodeMirror-lint-markers',
    ],
  });
}

export { setupCodeMirror };
