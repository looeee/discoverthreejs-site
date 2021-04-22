// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export function addClosebrackets(CodeMirror) {

  const defaults = {
    pairs: "()[]{}''\"\"",
    closeBefore: ")]}'\":;>",
    triples: '',
    explode: '[]{}',
  };

  const Pos = CodeMirror.Pos;

  CodeMirror.defineOption('autoCloseBrackets', false, (cm, val, old) => {
    if (old && old != CodeMirror.Init) {
      cm.removeKeyMap(keyMap);
      cm.state.closeBrackets = null;
    }
    if (val) {
      ensureBound(getOption(val, 'pairs'));
      cm.state.closeBrackets = val;
      cm.addKeyMap(keyMap);
    }
  });

  function getOption(conf, name) {
    if (name == 'pairs' && typeof conf === 'string') return conf;
    if (typeof conf === 'object' && conf[name] != null) return conf[name];
    return defaults[name];
  }

  var keyMap = {
    Backspace: handleBackspace,
    Enter: handleEnter,
  };

  function ensureBound(chars) {
    for (let i = 0; i < chars.length; i++) {
      const ch = chars.charAt(i);
      const key = "'" + ch + "'";
      if (!keyMap[key]) keyMap[key] = handler(ch);
    }
  }
  ensureBound(defaults.pairs + '`');

  function handler(ch) {
    return function (cm) {
      return handleChar(cm, ch);
    };
  }

  function getConfig(cm) {
    const deflt = cm.state.closeBrackets;
    if (!deflt || deflt.override) return deflt;
    const mode = cm.getModeAt(cm.getCursor());
    return mode.closeBrackets || deflt;
  }

  function handleBackspace(cm) {
    const conf = getConfig(cm);
    if (!conf || cm.getOption('disableInput')) return CodeMirror.Pass;

    const pairs = getOption(conf, 'pairs');
    const ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
      if (!ranges[i].empty()) return CodeMirror.Pass;
      const around = charsAround(cm, ranges[i].head);
      if (!around || pairs.indexOf(around) % 2 != 0) return CodeMirror.Pass;
    }
    for (var i = ranges.length - 1; i >= 0; i--) {
      const cur = ranges[i].head;
      cm.replaceRange('', Pos(cur.line, cur.ch - 1), Pos(cur.line, cur.ch + 1), '+delete');
    }
  }

  function handleEnter(cm) {
    const conf = getConfig(cm);
    const explode = conf && getOption(conf, 'explode');
    if (!explode || cm.getOption('disableInput')) return CodeMirror.Pass;

    let ranges = cm.listSelections();
    for (let i = 0; i < ranges.length; i++) {
      if (!ranges[i].empty()) return CodeMirror.Pass;
      const around = charsAround(cm, ranges[i].head);
      if (!around || explode.indexOf(around) % 2 != 0) return CodeMirror.Pass;
    }
    cm.operation(() => {
      const linesep = cm.lineSeparator() || '\n';
      cm.replaceSelection(linesep + linesep, null);
      cm.execCommand('goCharLeft');
      ranges = cm.listSelections();
      for (let i = 0; i < ranges.length; i++) {
        const line = ranges[i].head.line;
        cm.indentLine(line, null, true);
        cm.indentLine(line + 1, null, true);
      }
    });
  }

  function contractSelection(sel) {
    const inverted = CodeMirror.cmpPos(sel.anchor, sel.head) > 0;
    return {
      anchor: new Pos(sel.anchor.line, sel.anchor.ch + (inverted ? -1 : 1)),
      head: new Pos(sel.head.line, sel.head.ch + (inverted ? 1 : -1)),
    };
  }

  function handleChar(cm, ch) {
    const conf = getConfig(cm);
    if (!conf || cm.getOption('disableInput')) return CodeMirror.Pass;

    const pairs = getOption(conf, 'pairs');
    const pos = pairs.indexOf(ch);
    if (pos == -1) return CodeMirror.Pass;

    const closeBefore = getOption(conf, 'closeBefore');

    const triples = getOption(conf, 'triples');

    const identical = pairs.charAt(pos + 1) == ch;
    const ranges = cm.listSelections();
    const opening = pos % 2 == 0;

    let type;
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      const cur = range.head;
      var curType;
      const next = cm.getRange(cur, Pos(cur.line, cur.ch + 1));
      if (opening && !range.empty()) {
        curType = 'surround';
      } else if ((identical || !opening) && next == ch) {
        if (identical && stringStartsAfter(cm, cur)) {
          curType = 'both';
        } else if (triples.indexOf(ch) >= 0 && cm.getRange(cur, Pos(cur.line, cur.ch + 3)) == ch + ch + ch) {
          curType = 'skipThree';
        } else {
          curType = 'skip';
        }
      } else if (identical && cur.ch > 1 && triples.indexOf(ch) >= 0
        && cm.getRange(Pos(cur.line, cur.ch - 2), cur) == ch + ch) {
        if (cur.ch > 2 && /\bstring/.test(cm.getTokenTypeAt(Pos(cur.line, cur.ch - 2)))) return CodeMirror.Pass;
        curType = 'addFour';
      } else if (identical) {
        const prev = cur.ch == 0 ? ' ' : cm.getRange(Pos(cur.line, cur.ch - 1), cur);
        if (!CodeMirror.isWordChar(next) && prev != ch && !CodeMirror.isWordChar(prev)) curType = 'both';
        else return CodeMirror.Pass;
      } else if (opening && (next.length === 0 || /\s/.test(next) || closeBefore.indexOf(next) > -1)) {
        curType = 'both';
      } else {
        return CodeMirror.Pass;
      }
      if (!type) type = curType;
      else if (type != curType) return CodeMirror.Pass;
    }

    const left = pos % 2 ? pairs.charAt(pos - 1) : ch;
    const right = pos % 2 ? ch : pairs.charAt(pos + 1);
    cm.operation(() => {
      if (type == 'skip') {
        cm.execCommand('goCharRight');
      } else if (type == 'skipThree') {
        for (var i = 0; i < 3; i++) {
          cm.execCommand('goCharRight');
        }
      } else if (type == 'surround') {
        let sels = cm.getSelections();
        for (var i = 0; i < sels.length; i++) {
          sels[i] = left + sels[i] + right;
        }
        cm.replaceSelections(sels, 'around');
        sels = cm.listSelections()
          .slice();
        for (var i = 0; i < sels.length; i++) {
          sels[i] = contractSelection(sels[i]);
        }
        cm.setSelections(sels);
      } else if (type == 'both') {
        cm.replaceSelection(left + right, null);
        cm.triggerElectric(left + right);
        cm.execCommand('goCharLeft');
      } else if (type == 'addFour') {
        cm.replaceSelection(left + left + left + left, 'before');
        cm.execCommand('goCharRight');
      }
    });
  }

  function charsAround(cm, pos) {
    const str = cm.getRange(Pos(pos.line, pos.ch - 1),
      Pos(pos.line, pos.ch + 1));
    return str.length == 2 ? str : null;
  }

  function stringStartsAfter(cm, pos) {
    const token = cm.getTokenAt(Pos(pos.line, pos.ch + 1));
    return /\bstring/.test(token.type) && token.start == pos.ch
      && (pos.ch == 0 || !/\bstring/.test(cm.getTokenTypeAt(pos)));
  }
}