// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export function addIndentfold(CodeMirror) {

  function lineIndent(cm, lineNo) {
    const text = cm.getLine(lineNo);
    const spaceTo = text.search(/\S/);
    if (spaceTo == -1 || /\bcomment\b/.test(cm.getTokenTypeAt(CodeMirror.Pos(lineNo, spaceTo + 1)))) {
      return -1;
    }
    return CodeMirror.countColumn(text, null, cm.getOption('tabSize'));
  }

  CodeMirror.registerHelper('fold', 'indent', (cm, start) => {
    const myIndent = lineIndent(cm, start.line);
    if (myIndent < 0) return;
    let lastLineInFold = null;

    // Go through lines until we find a line that definitely doesn't belong in
    // the block we're folding, or to the end.
    for (let i = start.line + 1, end = cm.lastLine(); i <= end; ++i) {
      const indent = lineIndent(cm, i);
      if (indent == -1) { } else if (indent > myIndent) {
        // Lines with a greater indent are considered part of the block.
        lastLineInFold = i;
      } else {
        // If this line has non-space, non-comment content, and is
        // indented less or equal to the start line, it is the start of
        // another block.
        break;
      }
    }
    if (lastLineInFold) {
      return {
        from: CodeMirror.Pos(start.line, cm.getLine(start.line)
          .length),
        to: CodeMirror.Pos(lastLineInFold, cm.getLine(lastLineInFold)
          .length),
      };
    }
  });

}
