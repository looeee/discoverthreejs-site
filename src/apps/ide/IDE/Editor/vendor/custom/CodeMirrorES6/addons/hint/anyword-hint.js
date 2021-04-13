// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export function addAnywordhint(CodeMirror) {

  const WORD = /[\w$]+/;
  const RANGE = 500;

  CodeMirror.registerHelper('hint', 'anyword', (editor, options) => {
    const word = options && options.word || WORD;
    const range = options && options.range || RANGE;
    const cur = editor.getCursor();
    const curLine = editor.getLine(cur.line);
    const end = cur.ch;
    let start = end;
    while (start && word.test(curLine.charAt(start - 1))) --start;
    const curWord = start != end && curLine.slice(start, end);

    const list = options && options.list || [];
    const seen = {};
    const re = new RegExp(word.source, 'g');
    for (let dir = -1; dir <= 1; dir += 2) {
      let line = cur.line;
      const endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
      for (; line != endLine; line += dir) {
        const text = editor.getLine(line);
        var m;
        while (m = re.exec(text)) {
          if (line == cur.line && m[0] === curWord) continue;
          if ((!curWord || m[0].lastIndexOf(curWord, 0) == 0) && !Object.prototype.hasOwnProperty.call(seen,
            m[0])) {
            seen[m[0]] = true;
            list.push(m[0]);
          }
        }
      }
    }
    return {
      list,
      from: CodeMirror.Pos(cur.line, start),
      to: CodeMirror.Pos(cur.line, end),
    };
  });
}
