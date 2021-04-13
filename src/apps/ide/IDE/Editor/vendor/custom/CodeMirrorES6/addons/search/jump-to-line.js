// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Defines jumpToLine command. Uses dialog.js if present.

export function addJumptoline(CodeMirror) {

  function dialog(cm, text, shortText, deflt, f) {
    if (cm.openDialog) {
      cm.openDialog(text, f, {
        value: deflt,
        selectValueOnOpen: true,
      });
    } else f(prompt(shortText, deflt));
  }

  function getJumpDialog(cm) {
    return cm.phrase('Jump to line:')
      + ' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">'
      + cm.phrase('(Use line:column or scroll% syntax)') + '</span>';
  }

  function interpretLine(cm, string) {
    const num = Number(string);
    if (/^[-+]/.test(string)) {
      return cm.getCursor()
        .line + num;
    }
    return num - 1;
  }

  CodeMirror.commands.jumpToLine = function (cm) {
    const cur = cm.getCursor();
    dialog(cm, getJumpDialog(cm), cm.phrase('Jump to line:'), (cur.line + 1) + ':' + cur.ch, (posStr) => {
      if (!posStr) return;

      let match;
      if (match = /^\s*([\+\-]?\d+)\s*\:\s*(\d+)\s*$/.exec(posStr)) {
        cm.setCursor(interpretLine(cm, match[1]), Number(match[2]));
      } else if (match = /^\s*([\+\-]?\d+(\.\d+)?)\%\s*/.exec(posStr)) {
        let line = Math.round(cm.lineCount() * Number(match[1]) / 100);
        if (/^[-+]/.test(match[1])) line = cur.line + line + 1;
        cm.setCursor(line - 1, cur.ch);
      } else if (match = /^\s*\:?\s*([\+\-]?\d+)\s*/.exec(posStr)) {
        cm.setCursor(interpretLine(cm, match[1]), cur.ch);
      }
    });
  };

  CodeMirror.keyMap.default['Alt-G'] = 'jumpToLine';
}
